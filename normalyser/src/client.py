import grpc
import normalyser_pb2_grpc

from dump_data import request_transactions

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = normalyser_pb2_grpc.NormalyserServiceStub(channel)

        response_merchant = stub.normalizeMerchant(request_transactions)
        print(f"Server response for Merchant: {response_merchant}")

        response_pattern = stub.normalizePattern(request_transactions)
        print(f"Server response for PATTERN: {response_pattern}")

if __name__ == '__main__':
    run()
