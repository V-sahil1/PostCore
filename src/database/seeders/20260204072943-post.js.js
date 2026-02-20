'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const posts = [];

    for (let i = 1; i <= 50; i++) {
      posts.push({
        title: `Post Title ${i}`,
        user_id: Math.floor(Math.random() * 15) + 1, // random between 1–15
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return queryInterface.bulkInsert('posts', posts);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('posts', null, {});
  },
};
