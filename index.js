const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
//var morgan = require('morgan')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(express.json())
  app.use(requestLogger)
  //morgan('tiny')
  app.use(morgan('tiny'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/info', (request,response)=>{
    response.send(
        `<p>
            Phonebook has info for ${persons.length} people
            <br /> 
            ${Date()}
        </p>`
    )
})

app.get('/api/persons/:id', (request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person=>person.id===id)
    person ? response.json(person) : response.status(404).end()

})

const generateId = () => {
    const maxPersons = persons.length>0
        ? Math.max(...persons.map(person=>person.id))
        : 0
    return maxPersons+1
}

app.post('/api/persons',(request,response)=>{
    const body = request.body
    if (!body.name){
       return response.status(400).json({error:'missing name'})
    }else if (persons.find(person=>body.name===person.name)){
        return response.status(400).json({error:'name already is added'})
    }else if (!body.number){
        return response.status(400).json({error:'missing number'})
    }

    const contact = {
        name:body.name,
        number:body.number,
        id: generateId()
    }

    persons = persons.concat(contact)
    response.json(contact)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})