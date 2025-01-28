import grpc
import normalyser_pb2
import normalyser_pb2_grpc

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = normalyser_pb2_grpc.NormalyserServiceStub(channel)
        
        request_transactions = normalyser_pb2.TransactionsRequest(
            transactions=[
                normalyser_pb2.Transaction(
                    date="2024-01-01",
                    description="NFLX DIGITAL NTFLX US",
                    amount="19.99"
                ),
                normalyser_pb2.Transaction(
                    date="2024-01-01",
                    description="AMZN MKTP US*Z1234ABC",
                    amount="89.97"
                ),
                normalyser_pb2.Transaction(
                    date="2024-01-02",
                    description="UBER   *TRIP HELP.UBER.CO",
                    amount="35.50"
                ),
                normalyser_pb2.Transaction(
                    date="2024-01-02",
                    description="SPOTIFY P5D4E9B1D1",
                    amount="9.99"
                ),
                normalyser_pb2.Transaction(
                    date="2024-01-03",
                    description="TST* THAI SPICE",
                    amount="42.15"
                )
            ]
        )

        # response_merchant = stub.normalizeMerchant(request_transactions)
        # print(f"Server response for Merchant: {response_merchant}")

        response_pattern = stub.normalizePattern(request_transactions)
        print(f"Server response for PATTERN: {response_pattern}")

if __name__ == '__main__':
    run()
