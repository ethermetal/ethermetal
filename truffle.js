module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8550,
      network_id: "*" // Match any network id
    }
  }
};
