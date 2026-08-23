import app from './src/app'
import { PORT } from './src/utils/config'

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
