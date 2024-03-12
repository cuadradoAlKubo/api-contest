const {
  request,
  response
} = require('express');
const {
  Router
} = require('express');



const router = Router()


router.get('/', (req, res) => {
  res.status(200).json({
      msg:'Contest API Online'
  })
});


module.exports = router