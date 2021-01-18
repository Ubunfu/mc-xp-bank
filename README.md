# mc-xp-bank
[![Latest Release](https://img.shields.io/github/v/release/Ubunfu/mc-xp-bank)](https://github.com/Ubunfu/mc-xp-bank/releases)
[![codecov](https://codecov.io/gh/Ubunfu/mc-xp-bank/branch/master/graph/badge.svg?token=UPDATE-ME)](https://codecov.io/gh/Ubunfu/mc-xp-bank)
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