# mc-xp-bank
[![Latest Release](https://img.shields.io/github/v/release/Ubunfu/mc-xp-bank)](https://github.com/Ubunfu/mc-xp-bank/releases)
[![codecov](https://codecov.io/gh/Ubunfu/mc-xp-bank/branch/master/graph/badge.svg?token=uRJSpx2Faw)](https://codecov.io/gh/Ubunfu/mc-xp-bank)
[![CircleCI](https://img.shields.io/circleci/build/github/Ubunfu/mc-xp-bank?logo=circleci)](https://app.circleci.com/pipelines/github/Ubunfu/mc-xp-bank)
![Contrubutors](https://img.shields.io/github/contributors/Ubunfu/mc-xp-bank?color=blue)
![Last Commit](https://img.shields.io/github/last-commit/Ubunfu/mc-xp-bank)

Processes CRUD operations for the user XP banking system.

This service runs as an AWS lambda function.

## Configuration

### Environment Variables
| Parameter          | Description                                                                       | Default | Required? |
|--------------------|-----------------------------------------------------------------------------------|---------|-----------|
| LOGGER_ENABLED     | Boolean value controlling writing of logs. Useful to turn off for test execution. | n/a     | Yes       |
| SERVER_HOST        | Minecraft server hostname.                                                        | n/a     | Yes       |
| SERVER_RCON_PORT   | Port on which RCON service is listening on the minecraft server.                  | n/a     | Yes       |
| SERVER_RCON_PASS   | Password used to authenticate with the RCON service.                              | n/a     | Yes       |
| SERVER_RCON_TIMEOUT_MS   | Timeout in milliseconds for connections to the RCON service.                | n/a     | Yes       |
| TABLE_XP           | Name of the DynamoDB table containing XP account balances.                        | n/a     | Yes       |
| ESSENTIALS_X       | Boolean indicating if the EssentialsX plugin is running on the minecraft server   | False   | No        |