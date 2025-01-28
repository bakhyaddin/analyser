import grpc
from concurrent import futures
from dotenv import load_dotenv

import normalyser_pb2_grpc
from service import NormalyserServiceServicer

# Load variables from the .env file
load_dotenv()


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    normalyser_pb2_grpc.add_NormalyserServiceServicer_to_server(NormalyserServiceServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()

    print("GRPS server is up on port 50051")

    server.wait_for_termination()

if __name__ == '__main__':
    print("GRPS server is getting started")
    serve()
