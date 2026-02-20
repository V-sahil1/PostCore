'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const comments = [];

    for (let i = 1; i <= 50; i++) {

      const isGuest = Math.random() < 0.4; // 40% guest comments

      comments.push({
        description: `This is comment number ${i}`,
        is_guest: isGuest,
        user_id: isGuest ? null : Math.floor(Math.random() * 10) + 1, // 1–10 if not guest
        post_id: Math.floor(Math.random() * 6) + 1, // 1–6 always required
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return queryInterface.bulkInsert('comments', comments);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('comments', null, {});
  },
};
