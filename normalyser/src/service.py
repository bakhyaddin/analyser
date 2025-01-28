import json

from normalyser_pb2 import NormalisedMerchantsResponse, NormalisedMerchant, NormalisedPatternsResponse, NormalisedPattern
import normalyser_pb2_grpc

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

class NormalyserServiceServicer(normalyser_pb2_grpc.NormalyserServiceServicer):
    def normalizeMerchant(self, request, context):
        chat = ChatOpenAI()
        prompt_template = ChatPromptTemplate.from_template(
            """
            You are a smart assistant that normalizes merchant data. Normalize the given transaction history data into the following JSON format:
            {{
                "name": "<merchant_name>",
                "originalName": "<merchant_name>" // Extract original name out of the input data
                "category": "<category>",
                "subCategory": "<sub_category>",
                "confidence": <confidence>,  // A number between 0 and 1 representing your confidence level.
                "isSubscription": <true/false>,  // Indicates if this is a subscription service.
                "flags": [<relevant flags>]  // Additional flags like "online_purchase", "marketplace" relevant to the merchant.
            }}
            Transactions data is as the following. the structure is -> transaction_date, merchant_unnormalized_name, trasaction_amount:
            {data}

            Generate JSON output for each transaction, aligning with the described format. Respond with an array of normalized objects.
            Merchant names must be unique!!
            """
        )

        input_data = "\n".join(
            f"{transaction.date}, {transaction.description}, {transaction.amount}" for transaction in request.transactions
        )

        prompt = prompt_template.format(data=input_data)
        original_response = chat(prompt)
        parsed_response = json.loads(original_response.content)
        # parsed_response =  [{'name': 'Netflix', 'category': 'Streaming Services', 'subCategory': '', 'confidence': 1, 'isSubscription': True, 'flags': []}, {'name': 'Amazon', 'category': 'Retail', 'subCategory': 'Online Marketplace', 'confidence': 1, 'isSubscription': False, 'flags': ['online_purchase', 'marketplace']}, {'name': 'Uber', 'category': 'Transportation', 'subCategory': 'Ride Sharing', 'confidence': 1, 'isSubscription': False, 'flags': []}, {'name': 'Spotify', 'category': 'Streaming Services', 'subCategory': 'Music', 'confidence': 1, 'isSubscription': True, 'flags': []}, {'name': 'Thai Spice', 'category': 'Dining', 'subCategory': 'Restaurant', 'confidence': 1, 'isSubscription': False, 'flags': []}]

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
            You are a smart assistant that normalizes patterns from transaction datasets. Normalize the given transaction data into the following JSON format:

            {{
                "type": "<type>",  // The type of the transaction. (e.g., "subscription", "transaction" etc.)
                "merchant": "<merchant_name>",  // The normalized merchant name.
                "amount": <amount>,  // The transaction amount.
                "frequency": "<frequency>",  // The transaction frequency. This can obtained by analysing the "transaction_date" in the input data (e.g., "monthly", "one-time", etc.).
                "confidence": <confidence>,  // A number between 0 and 1 indicating normalization confidence.
                "nextExpected": "<nextExpected_date>"  // The next expected transaction date, if applicable. Otherwise lease as "null"
                "notes": "<additional_notes>" // Additional notes based on the spending habbits. This can be understood based on transaction amounts and transaction dates 
            }}

            Transactions data is as the following. the structure is -> transaction_date, merchant_unnormalized_name, trasaction_amount:
            {data}

            Generate JSON output for each transaction, aligning with the described format. Respond with an array of normalized objects.
            """
        )

        input_data = "\n".join(
            f"{transaction.date}, {transaction.description}, {transaction.amount}" for transaction in request.transactions
        )

        prompt = prompt_template.format(data=input_data)
        original_response = chat(prompt)
        parsed_response = json.loads(original_response.content)
        # parsed_response = [{'type': 'subscription', 'merchant': 'Netflix', 'amount': 0.99, 'frequency': 'monthly', 'confidence': 0.9, 'nextExpected': '2024-02-01'}, {'type': 'transaction', 'merchant': 'Amazon', 'amount': 0.97, 'frequency': 'one-time', 'confidence': 0.8, 'nextExpected': ''}, {'type': 'ride', 'merchant': 'Uber', 'amount': 0.50, 'frequency': 'one-time', 'confidence': 0.7, 'nextExpected': ''}, {'type': 'subscription', 'merchant': 'Spotify', 'amount': 0.99, 'frequency': 'monthly', 'confidence': 0.85, 'nextExpected': '2024-02-02'}, {'type': 'transaction', 'merchant': 'Thai Spice', 'amount': 0.15, 'frequency': 'one-time', 'confidence': 0.75, 'nextExpected': ''}]

        print("PARCED PATTERN RESPONSE", parsed_response)

        normalised_patterns=[
            NormalisedPattern(**item)
            for item in parsed_response
        ]
        
        return NormalisedPatternsResponse(normalisedPatterns=normalised_patterns)
