const faker = require('faker')
const times = require('lodash').times
const sample = require('lodash').sample
const shuffle = require('lodash').shuffle
const random = require('lodash').random

const translates = require('./i18n/translates')

const languages = [{
  code: 'en',
  label: 'English',
  locale: 'en',
  isDefault: true,
  catalog: translates.en,
}, {
  code: 'ru',
  label: 'Русский',
  locale: 'ru',
  isDefault: false,
  catalog: translates.ru,
}]

const createUser = (user = {}) => {
  const firstName = user.firstName || faker.name.firstName()
  const lastName = user.lastName || faker.name.lastName()
  return {
    firstName,
    lastName,
    password: null,
    name: [firstName, lastName].join(' '),
    email: [
      [firstName, lastName].join('.').toLowerCase(),
      faker.internet.email().split('@')[1],
    ].join('@'),
    avatar: faker.image.avatar(),
    isAdmin: false,
    ...user,
  }
}

const createPostBody = () => {
  return shuffle([
    ...times(random(20, 30), () => `<p>${faker.lorem.paragraph()}</p>`),
    ...times(2, (n) => `<blockquote>image ${faker.lorem.paragraph()}<img src="${faker.image.avatar()}" alt="blockquote-avatar-${n}" /></blockquote>`),
    ...times(2, () => `<ul>${times(random(5, 10), () => `<li>${faker.lorem.sentence()}</li>`).join('')}</ul>`),
    ...times(2, () => `<ol>${times(random(5, 10), () => `<li>${faker.lorem.sentence()}</li>`).join('')}</ol>`),
    ...times(2, (n) => `<p><img src="${faker.image.image()}" alt="image-${n}" /></p>`),
  ]).join('')
}

// all passwords 1234567890
// bcrypt.hashSync('1234567890', 12)
const passwords = [
  '$2b$12$HL16rIqA3PvhTGvTSCXKv.bV9J4Z9davLd4PiBgGrGituhgFqkw8i',
  '$2b$12$XbTY78r9XKSDjwv4ZtJmMOb44vgfPIXwjMBaWg3EwCbNca3c.zyjW',
  '$2b$12$EUOUKvgZGeHxomEmRk1Ck.GCH/JpKEZ33amtFz3ISvb3f4I2mW2Re',
  '$2b$12$ZRrZnVHF98PpDiYFyHlcs.AJpW8p5y2.Ck5q2lAX9ZBbhI62dPNRa',
  '$2b$12$NGqZYqOKvwOeyM1k9T50TuQgYv/l6f7asoB64A3Wh4qk3lDlI1h1a',
  '$2b$12$xvT43WmpWifkGo2jH0uffOxt/XhcTHx4bos8r/HtB4AYziB/Jv6cK',
  '$2b$12$ynWAxVfKL5VWX6lo8fLE2.4xqzQWAzWejABrozH19.KDuYHrtkXhe',
  '$2b$12$odb/HIQveHq0wqiyZO5Eu.KngTXZmk3FJf.vS8a70Epl8wdIkIw1e',
  '$2b$12$EHTdetPgw8lSlVq1EHkJCePMn9HPEp5HO62RWLbJOBrc.HvFTBgnO',
  '$2b$12$diBR9VFji//IGh57/49xhuQKmZgqzqjNY2UBd5YGa.IKKA7wItCtm',
]


module.exports = function () {
  const userAdmin = createUser({
    id: String(1),
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    isAdmin: true,
    password: passwords[0],
  })
  const basicUser = createUser({
    id: String(2),
    firstName: 'User',
    lastName: 'Basic',
    email: 'user.basic@gmail.com',
    password: passwords[1],
  })
  const userBanned = createUser({
    id: String(3),
    firstName: 'Bad',
    lastName: 'Boy',
    email: 'bad.boy@gmail.com',
    password: passwords[2],
  })
  const authors = [
    basicUser,
    userBanned,
  ].concat(times(7, (n) => createUser({
    id: String(n + 4),
    password: passwords[n + 4],
  })))

  const posts = times(100, (n) => ({
    id: String(n + 1),
    userId: sample(authors).id,
    image: `static/assets/images/img-${n % 14 + 1}.jpg`,
    slug: faker.lorem.slug(),
    title: faker.lorem.sentence(),
    body: createPostBody(),
    bodyShort: faker.random.words(Math.ceil(Math.random() * 16 + 4)),
    publishedAt: faker.date.past(),
  }))

  const comments = times(500, (n) => {
    return {
      id: String(n + 1),
      postId: sample(posts).id,
      userId: sample(authors).id,
      comment: faker.random.words(Math.ceil(Math.random() * 26 + 4)),
      addedAt: faker.date.past(),
      updatedAt: undefined,
    }
  })

  return {
    languages,
    users: [
      userAdmin,
      ...authors,
    ],
    posts,
    comments,
    banned: [{
      isBanned: true,
      bannedAt: faker.date.past(),
      editedAt: null,
      id: '1',
      userId: userBanned.id,
      adminId: userAdmin.id,
      comment: 'Rules violation',
    }],
  }
}
