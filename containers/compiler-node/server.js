const { io } = require('socket.io-client');
const terminal = require('node-pty');
const os = require('os');
const fs = require('fs')


const socket = io('http://192.168.1.13:4805');

socket.on(`${os.hostname()}_compile`, (data) => {
    if (data.language === "py") {
        try {
            // Generate random string of length 10
            const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // get current working directory to store the file
            const cwd = process.cwd();
            // create directory named 'py' if not exists
            if (!fs.existsSync(`${cwd}/py`)) {
                fs.mkdirSync(`${cwd}/py`);
            }
            fs.writeFileSync(`${cwd}/py/${randomString}.py`, data.code);

            // execute the file
            const pty = terminal.spawn('python', [`${cwd}/py/${randomString}.py`], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: `${cwd}/py`,
                env: process.env
            });

            //pty.write(`python ${cwd}/py/${randomString}.py \r`);

            pty.on('data', (out) => {

                socket.emit(`compile_result`, {
                    "out": out,
                    "language": data.language,
                    "source": os.hostname() 
                });
                //pty.kill();
            });

            pty.onExit((code) => {
                fs.unlinkSync(`${cwd}/py/${randomString}.py`);
            });


        } catch (error) {
            console.log("Throwing : " + error);

            const errorEmit = {
                "source": os.hostname(),
                "error": 'Error in writing file'
            };

            socket.emit('error', errorEmit);
        }
    }
    else if (data.language === "c") {}
    else if (data.language === "cpp") {}
    else if (data.language === "java") {}
});

