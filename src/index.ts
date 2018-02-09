import { App } from './app';
import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';
import { Application } from 'express';

export interface ICommandOptions {
  kafkaHost: string;
  schemaRegistry: string;
  logFolder: string;
  port: number;
  help?: boolean;
}

export class CommandLineInterface {
  public static optionDefinitions: OptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      typeLabel: '[underline]{Boolean}',
      description: 'Show help text'
    },
    {
      name: 'port',
      alias: 'p',
      type: Number,
      defaultValue: 8100,
      typeLabel: '[underline]{Number}',
      description: 'Endpoint port, e.g. http://localhost:PORT/time'
    },
    {
      name: 'kafkaHost',
      alias: 'k',
      type: String,
      defaultValue: 'localhost:3501',
      typeLabel: '[underline]{String}',
      description: 'Kafka broker host, e.g. localhost:3501'
    },
    {
      name: 'logFolder',
      alias: 'f',
      type: String,
      defaultValue: './logs',
      defaultOption: true,
      typeLabel: '[underline]{String}',
      description: 'Location of the log files, default ./logs'
    },
    {
      name: 'schemaRegistry',
      alias: 's',
      type: String,
      defaultValue: 'localhost:3502',
      typeLabel: '[underline]{String}',
      description: 'Schema registry, e.g. localhost:3502'
    }
  ];

  public static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    Replay logged messages that are stored inside a, potentially mounted, folder. The folder
    layout is using the following convention:
    ROOT
    - logs
      - SESSION_NAME261006
        - TOPIC_NAME
          - TIMESTAMP_SCHEMA_NAME
261006    `
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. Start the service.',
          example: `$ ${npmPackage.name}`
        },
        {
          desc: '02. Start the service, sending out time messages every second.',
          example: `$ ${npmPackage.name} -i 1000`
        },
        {
          desc: '03. Start the service on port 8080.',
          example: `$ ${npmPackage.name} - 8080`
        }
      ]
    }
  ];
}

const options: ICommandOptions = commandLineArgs(CommandLineInterface.optionDefinitions);

if (options.help) {
  // tslint:disable-next-line:no-var-requires
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  const log = console.log;
  log(usage);
  process.exit(0);
}
const app: Application = new App(options).getApp();
export { app };