declare module 'logstash-client' {
  interface LogstashOptions {
    // Define the structure of Logstash options here
    host: string
    port: number
    // Add other options as needed
  }

  class Logstash {
    constructor(options: LogstashOptions)

    // Define methods and properties as needed
  }

  export = Logstash
}
