#!/bin/bash

# Запрашиваем у пользователя TMDb токен
read -p "Введите ваш TMDb Bearer токен: " tmdb_token

# Создаём директорию
sudo mkdir /home/nmprs

# Назначаем владельца
sudo chown -R $USER:$USER /home/nmprs

# Скачиваем бинарник
sudo wget https://github.com/trinity-aml/NUMParser/releases/download/numParser_1.7/numParser-linux-amd64  -O /home/nmprs/numParser-linux-amd64

# Делаем его исполняемым
sudo chmod o+x /home/nmprs/numParser-linux-amd64

# Создаём systemd-юнит
echo -e '[Unit]\nDescription=nmprs\nWants=network.target\nAfter=network.target\n\n[Service]\nWorkingDirectory=/home/nmprs\nExecStart=/home/nmprs/numParser-linux-amd64\nRestart=always\n\n[Install]\nWantedBy=multi-user.target' | sudo tee /etc/systemd/system/nmprs.service > /dev/null

# Создаём конфиг с введённым токеном
echo -e "port: 9090\nhost: http://rutor.info\ntmdbtoken: Bearer $tmdb_token" | sudo tee /home/nmprs/config.yml > /dev/null

# Перезагружаем демон systemd
sudo systemctl daemon-reload

# Запускаем и включаем сервис
sudo systemctl start nmprs
sudo systemctl enable nmprs

echo "Установка завершена. Сервис nmprs запущен на порту 9090."
