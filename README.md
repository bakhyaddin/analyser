# Financial Transaction Analysis System

## **Overview**
This repository contains a **comprehensive financial transaction analysis system** that leverages AI to **normalize merchants and detect transaction patterns**. The system consists of **three core services** working together to process, analyze, and visualize financial transactions.

## **Architecture**
The system is built with a **modular and scalable microservices architecture**, separating concerns between **API processing, AI-powered normalization, and frontend visualization**. It consists of the following services:

### **1. Analyser API (`analyser-api`)**
- **Backend service** built with **NestJS**.
- Handles **user requests**, including:
  - **Listing past analyses.**
  - **Starting a new financial analysis.**
  - **Managing file uploads for transaction analysis.**
  - **Deleting old analyses.**
- Acts as the **main orchestrator** by interacting with the **Normalyser service** to fetch AI-generated results.

### **2. Normalization Service (`normalyser`)**
- **AI-powered gRPC service** built with **Python (gRPC & LangChain)**.
- Processes raw financial transactions to:
  - **Normalize merchant names, categories, and attributes.**
  - **Identify transaction patterns (e.g., recurring, subscriptions).**
- Uses **ChatOpenAI** for AI-driven merchant and pattern detection.
- Runs behind **gRPC Secure (gRPCS)** and provides **structured transaction insights** to the `analyser-api`.

### **3. Frontend Web Application (`analyser-web`)**
- **User-facing frontend** built with **React**.
- Provides an **interactive dashboard** for:
  - **Uploading transaction files.**
  - **Viewing normalized merchant insights.**
  - **Exploring detected spending patterns.**
  - **Managing financial analyses.**
- Communicates with `analyser-api` via RESTful APIs.

---

## **Workflow**
1. **User uploads a transaction file** via the frontend (`analyser-web`).
2. The file is sent to the backend (`analyser-api`), which generates an **S3 bucket URL** for upload.
3. Once uploaded, `analyser-api` triggers the **analysis process**.
4. The **Normalyser service (`normalyser`)** receives the request via **gRPC**, normalizes the data using AI, and returns structured merchant and pattern insights.
5. The results are **stored and displayed** via the frontend (`analyser-web`), where users can explore and manage their transaction history.

---

## **Tech Stack**
| **Service**       | **Technology Stack**                                      |
|------------------|----------------------------------------------------------|
| `analyser-api`  | **NestJS**, **PostgreSQL**, **TypeORM**, **S3 (for file storage)** |
| `normalyser`    | **Python**, **gRPC**, **LangChain**, **ChatOpenAI**        |
| `analyser-web`  | **React**, **Vite**, **TailwindCSS**, **REST API Integration** |

