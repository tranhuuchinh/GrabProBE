const app = require("./app");

const port = process.env.PORT || 3007;

const server = app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});
