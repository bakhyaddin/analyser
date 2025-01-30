import json

from normalyser_pb2 import NormalisedMerchantsResponse, NormalisedMerchant, NormalisedPatternsResponse, NormalisedPattern
import normalyser_pb2_grpc

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

class NormalyserServiceServicer(normalyser_pb2_grpc.NormalyserServiceServicer):
    def transactions_to_dict(self, transactions):
        return [
            {
                "date": transaction.date,
                "description": transaction.description,
                "amount": transaction.amount
            }
            for transaction in transactions
        ]


    def normalizeMerchant(self, request, context):
        chat = ChatOpenAI()
        prompt_template = ChatPromptTemplate.from_template(
            """
            You are given a list of banking transactions in JSON format, for example:
            [
            {{
                "date": "2024-01-01",
                "description": "NFLX DIGITAL NTFLX US",
                "amount": 19.99
            }},
            {{
                "date": "2024-01-05",
                "description": "AMZN MKTP US*Y789XYZ",
                "amount": 89.97
            }},
            ...
            ]

            Each transaction has:
            - "date": in YYYY-MM-DD format
            - "description": the raw text for the merchant
            - "amount": a float

            **Task**:

            1. For each unique merchant (based on the logic below), generate exactly one JSON object with:
            - name: a concise merchant name (e.g., "Netflix", "Amazon", "Uber") derived from the transaction description
            - originalName: the exact 'description' string that led you to this merchant
            - category: a broad category (e.g. "Shopping", "Entertainment", "Food & Beverage")
            - subCategory: a more specific sub-category (e.g. "Online Retail", "Streaming", "Rideshare")
            - confidence: a float in [0,1] indicating your confidence in the classification
            - isSubscription: true/false
            - flags: a list of relevant flags (e.g., ["online_purchase", "digital_service", "marketplace"])

            2. **Unifying vs. Distinguishing Merchants**:
            - Sometimes a single brand may appear under slightly different raw descriptions. If the descriptions clearly belong to the same merchant (e.g., recognizable brand keywords, same brand name in multiple forms), unify them under one "name" and produce one merchant object for all those descriptions.
            - However, if the description includes a platform/aggregator plus a distinct business or brand (e.g., "XYZ Delivery*RestaurantA" vs. "XYZ Delivery*RestaurantB"), these should remain separate merchant objects because they reference different end merchants.

            3. **Determine 'isSubscription'**:
            - If the pattern of dates AND the known business clearly indicates a recurring subscription, set 'isSubscription' to true.
            - Specifically:
                - Check if charges occur at regular intervals (e.g. same or close amounts, spaced roughly monthly or weekly).
                - If the brand is known to be subscription-based (e.g. "Netflix", "Spotify", "Hulu", etc.), that's a strong indicator.
                - Otherwise, set 'isSubscription' to false.

            4. **Determine 'flags'** (Array of strings):
            - Based on your knowledge of the merchants, provide relevant flags.
            - The flags can reflect online purchases, digital services, marketplaces, subscriptions, etc.

            **Important**:
            - Produce exactly ONE JSON array at the end, containing one object per merchant (after unifying or separating appropriately).
            - Each object includes the fields mentioned above.
            - Do not produce any extra text; output only valid JSON.
            - If you see repeated transactions that should unify under the same merchant, merge them into a single object. If they should remain distinct, produce separate objects.

            Now, here is the ENTIRE transactions list in JSON:
            {data}

            **Please** output a JSON array of normalized merchant objects, one per merchant.
            """
        )

        input_data = json.dumps(self.transactions_to_dict(request.transactions))
        prompt = prompt_template.format(data=input_data)
        original_response = chat(prompt)
        parsed_response = json.loads(original_response.content)

        print("PARCED MERCHANT RESPONSE", parsed_response)

        normalised_merchants = [
            NormalisedMerchant(**item)
            for item in parsed_response
        ]

        return NormalisedMerchantsResponse(normalisedMerchants=normalised_merchants)

        

    def normalizePattern(self, request, context):
        chat = ChatOpenAI()
        prompt_template = ChatPromptTemplate.from_template(
            """
            You are given a list of banking transactions in JSON format, for example:
            [
            {{
                "date": "2024-01-01",
                "description": "NFLX DIGITAL NTFLX US",
                "amount": 19.99
            }},
            {{
                "date": "2024-01-05",
                "description": "AMZN MKTP US*Y789XYZ",
                "amount": 89.97
            }},
            ...
            ]

            Each transaction has:
            - "date": in YYYY-MM-DD format
            - "description": the raw text for the merchant
            - "amount": a float

            For each unique merchant (based on the logic below), generate exactly one JSON object with:
                - type: subscription", "recurring", or "one-time
                - merchant: a concise merchant name (e.g., "Netflix", "Amazon", "Uber") derived from the transaction description
                - amount: the exact transaction amount
                - frequency: e.g., "monthly", "weekly", "2-3 times per week", "one-time", etc.
                - confidence: a float in [0,1] indicating your confidence in the classification
                - nextExpected: next likely charge date if relevant, else null
                - notes: additional insights about spending habits or patterns

            **Classification Rules**:
            1. **type**:
            - "subscription": If the merchant is known for subscription-based services (e.g., Netflix, Spotify, Apple) 
                OR if repeated charges occur at regular intervals (monthly, weekly, same day each month) 
                for the same merchant + same (or nearly the same) amount.
            - "recurring": If the user makes frequent purchases from the same merchant (e.g., daily coffee, daily rideshare), 
                but it’s not a subscription service. 
            - "one-time": If the transaction does not belong to a subscription or recurring pattern.

            2. **merchant**:
            - Provide a concise, normalized name. 
            - If multiple raw descriptions clearly map to the same brand, unify them. 
            - However, if an aggregator (e.g., "DOORDASH*SUBWAY" vs "DOORDASH*MCDONALDS") 
                references different end merchants, keep them separate.

            3. **frequency**:
            - Determine the approximate frequency of the transactions for that merchant 
                (e.g., "monthly", "weekly", "2-3 times per week", "one-time", etc.).
            - If there’s only one transaction for that merchant, it’s likely "one-time".
            - If you detect a monthly or weekly pattern, specify "monthly" or "weekly".

            4. **confidence**:
            - A float (0 to 1) indicating how sure you are of this classification.

            5. **nextExpected**:
            - If the type is strongly indicated as "subscription", estimate the next date 
                based on the pattern you observe. If uncertain, set it to null.

            6. **notes**:
            - Mention any relevant observations regarding spending habits or amounts 
                (e.g., "User frequently orders rides on weekdays", "Monthly streaming subscription").

            **Important**:
            - You must respond with an array of JSON objects, **one for each transaction** in the input.
            - Applying the above classification rules
            - Do not provide any extra text outside of the valid JSON array.

            Now, here is the ENTIRE transactions list in JSON:
            {data}

            """
        )

        input_data = json.dumps(self.transactions_to_dict(request.transactions))
        prompt = prompt_template.format(data=input_data)
        original_response = chat(prompt)
        parsed_response = json.loads(original_response.content)

        print("PARCED PATTERN RESPONSE", parsed_response)

        normalised_patterns=[
            NormalisedPattern(**item)
            for item in parsed_response
        ]
        
        return NormalisedPatternsResponse(normalisedPatterns=normalised_patterns)
