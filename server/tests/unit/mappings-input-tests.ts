import test from 'tape'
import mapper from '../../src/helpers/props-mapper-input'

test('setup', async (t) => {
  t.end()
})

test('should be able to map props to an entity', (t) => {
  const catA1 = { title: 'a title' }
  const catA2 = mapper.mapCategory(catA1)
  t.equal(catA1.title, catA2.title)

  const prodA1 = { title: 'Porsche 911', description: 'A car' }
  const prodA2 = mapper.mapProduct(prodA1)
  t.equal(prodA1.title, prodA2.title)

  const userA1 = { firstName: 'Jesse', lastName: 'Cox' }
  const userA2 = mapper.mapUser(userA1)
  t.equal(userA1.firstName, userA2.firstName)
  t.end()
})

test('teardown', async (t) => {
  t.end()
})
