'use strict';

import bcrypt from 'bcrypt'

module.exports = {
  async up(queryInterface, Sequelize) {

    const hashedPassword = await bcrypt.hash("123", 10);

    const users = [];

    for (let i = 51; i <= 150; i++) {
      users.push({
        user_name: `demo_user_${i}`,
        email: `demo${i}@example.com`,
        password: hashedPassword,
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});

  },
};
