'use strict';


const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {

    const hashedPassword = await bcrypt.hash("123", 10);

    const users = [];

    // for (let i = 51; i <= 150; i++) {
      users.push({
        user_name: `sahil_vardekar_01`,
        email: `sahil5@gmail.com`,
        password: hashedPassword,
        role: "Admin",
        age:Math.floor(Math.random() * 30) + 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

    return queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});

  },
};
