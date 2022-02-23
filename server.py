
from flask import Flask, request
from flask_restful import Resource, Api, reqparse 
import redis
import docker
from flask_socketio import SocketIO
from flask_cors import CORS
from termColor import TermColor


r = redis.Redis(host="192.168.1.13", port=6379, password="yourpassword")
client = docker.from_env()
app = Flask(__name__)
CORS(app)
api = Api(app)
socketio = SocketIO(app, cors_allowed_origins="*")

STATUS_OK = {'status': 'OK'}

# socketio
@socketio.on('connect')
def connect():
    # get inet address of client
    client_ip = request.remote_addr
    print(f'{TermColor.OKBLUE}Client connected : {client_ip}{TermColor.ENDC}')



@socketio.on('disconnect')
def disconnect():
    print(f'{TermColor.WARNING}Client disconnected : {request.remote_addr}{TermColor.ENDC}')

@socketio.on('compile_result')
def compile_result(data):
    print(f"{TermColor.OKGREEN}compile_result: {data.get('out')}{TermColor.ENDC}")
    socketio.emit(data.get('source') + '_result', data.get('out'))

# REST API

@app.route("/")
def index():
    return STATUS_OK, 200

class Session(Resource):
    def get(self):
        
        # get inet address of client
        client_ip = request.remote_addr

        # create docker container from image 'compiler-node_compiler'
        container = client.containers.run('compiler-node_compiler', detach=True)

        # get container host name
        container_hostname = container.attrs['Config']['Hostname']

        # add container id to redis
        r.set(client_ip, container_hostname)
        
        return {"session": container_hostname}, 200
    
    def post(self):
        client_ip = request.remote_addr

        # get container id from redis
        container_id = r.get(client_ip).decode("utf-8")

        # remove container id from redis
        r.delete(client_ip)

        print(TermColor.OKGREEN + "Deleting container : " + container_id + TermColor.ENDC)

        #stop and remove container
        client.containers.get(container_id).stop()
        client.containers.get(container_id).remove()

        return STATUS_OK, 200

compiler_parser = reqparse.RequestParser(bundle_errors=True)


#compiler_parser.add_argument('SESSION_ID', type=str, required=True, help='Session ID')
compiler_parser.add_argument('CODE', type=str, required=True, help='Code')
compiler_parser.add_argument('LANGUAGE', type=str, required=True, help='Language')

class Compile(Resource):
    def get(self):

        args = compiler_parser.parse_args()
        host = r.get(request.remote_addr)
        
        data = {
            "language": args['LANGUAGE'],
            "code": args['CODE']
        }

        socketio.emit(host.decode("utf-8") + '_compile', data, broadcast=True)        
        return STATUS_OK, 200

        
api.add_resource(Session, '/session')
api.add_resource(Compile, '/compile')

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=4805)


