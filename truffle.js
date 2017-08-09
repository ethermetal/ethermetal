module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8550,
      network_id: "*" // Match any network id
    },
    live: {
       host: "localhost",
       port: 8545,
       network_id: "2"
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3"
    }
  }
};
