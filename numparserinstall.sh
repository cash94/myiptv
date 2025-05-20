sudo mkdir /home/nmprs

sudo chown -R $USER:$USER /home/nmprs

sudo wget https://github.com/trinity-aml/NUMParser/releases/download/numParser_1.7/numParser-linux-amd64 -O /home/nmprs/numParser-linux-amd64

sudo chmod o+x /home/nmprs/numParser-linux-amd64

echo -e '[Unit]\nDescription=nmprs\nWants=network.target\nAfter=network.target\n\n[Service]\nWorkingDirectory=/home/nmprs\nExecStart=/home/nmprs/numParser-linux-amd64\nRestart=always\n\n[Install]\nWantedBy=multi-user.target' | sudo tee /etc/systemd/system/nmprs.service > /dev/null

echo -e 'port: 9090\nhost: http://rutor.info\ntmdbtoken: Bearer syda svoi key' | sudo tee /home/nmprs/config.yml > /dev/null

sudo systemctl daemon-reload

sudo systemctl start nmprs

sudo systemctl enable nmprs

sudo apt install nano

sudo nano /home/nmprs/config.yml
