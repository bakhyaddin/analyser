# Normalization Service (gRPC)

## Introduction

The **Normalization Service** is a gRPC-based microservice designed to **normalize financial transaction data** by categorizing merchants and detecting transaction patterns. It integrates **AI-powered processing** using **LangChain and OpenAI** to analyze raw transaction data and return structured, high-confidence insights.

This service operates **independently** from the core **Financial Transaction Analysis Service**, which connects via **gRPC Secure (gRPCS)** and waits for the normalized results. The **Normalization Service** provides two key functions:

- **Merchant Normalization** – Standardizes merchant names, categories, and attributes.
- **Pattern Detection** – Identifies recurring transactions and spending patterns.

---

## **Architecture Overview**

- **Client (Core Service)**
  - Sends unstructured transaction data over **gRPCS**.
  - Waits for the AI-processed response.
- **Normalization Service**

  - Uses **LangChain's ChatOpenAI** to extract and structure merchant and pattern information.
  - Runs AI models to infer merchant names, categories, and transaction types.
  - Returns a structured **Protobuf response**.

- **External AI Processing**
  - **ChatOpenAI (GPT-based processing)**
  - Converts raw transactions into structured merchant and pattern data.

---

## **gRPC API Endpoints**

### **1. Merchant Normalization (`normalizeMerchant`)**

This method takes in **raw financial transactions** and returns **standardized merchant information**.

#### **Request:**

```proto
message NormaliseMerchantRequest {
  repeated Transaction transactions = 1;
}

message Transaction {
  string date = 1;
  string description = 2;
  double amount = 3;
}
```

#### **Response:**

```proto
message NormalisedMerchantsResponse {
  repeated NormalisedMerchant normalisedMerchants = 1;
}

message NormalisedMerchant {
  string name = 1;
  string originalName = 2;
  string category = 3;
  string subCategory = 4;
  float confidence = 5;
  bool isSubscription = 6;
  repeated string flags = 7;
}
```

Processing Flow:

- Receives transaction history with merchant names and amounts.
- Calls LangChain's ChatOpenAI with a structured prompt to generate normalized merchant details.
- Parses the AI response and constructs a gRPC-compliant response.
- Returns structured merchant data with categories, confidence levels, and flags.

### **2. Pattern Normalization (`normalizePattern`)**

This method analyzes **transaction patterns** to identify recurring **payments**, **subscriptions**, and **spending habits**.

#### **Request:**

```proto
message NormaliseMerchantRequest {
  repeated Transaction transactions = 1;
}

message Transaction {
  string date = 1;
  string description = 2;
  double amount = 3;
}
```

#### **Response:**

```proto
message NormalisedPatternsResponse {
  repeated NormalisedPattern normalisedPatterns = 1;
}

message NormalisedPattern {
  string type = 1;
  string merchant = 2;
  double amount = 3;
  string frequency = 4;
  float confidence = 5;
  string nextExpected = 6;
  string notes = 7;
}
```

Processing Flow:

- Receives raw transactions with merchant names, dates, and amounts.
- Calls LangChain's ChatOpenAI with a structured prompt to infer recurring transactions and spending behaviors.
- Parses the AI response and constructs a gRPC-compliant response.
- Returns structured transaction patterns including:
  - Transaction frequency (e.g., "monthly", "weekly", "one-time").
  - Next expected transaction date.
  - Additional notes on spending behavior.
