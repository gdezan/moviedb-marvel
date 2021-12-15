# Vi Backend Engineer Assignment

## Running

To run this application locally, first install the node dependencies with yarn:

```
yarn install
```

Then, we need to set up the environment variables. You can do that by copying the `.env.dev` file and setting the necessary fields.

```bash
cp .env.dev .env
```

Once that is done, you can run the server locally by executing the command

```
yarn dev
```

or by building and running the Docker image specified by the Dockerfile.

The server will open up on `http://localhost:8080`.

## Routes

A more detailed documentation of the API routes is available at the [/docs](http://localhost:8080/docs) page of the application (the application must be up and running).

### **GET /actor**

Search for an actor and look at their information.

#### _Example_

- Request (cURL)

```bash
curl --location --request GET 'http://localhost:8080/actor?query=chris evans'
```

- Response (JSON)

```json
{
  "name": "Chris Evans",
  "externalId": 16828,
  "movies": [
    {
      "externalId": 1771,
      "character": "Steve Rogers / Captain America",
      "language": "en",
      "releaseDate": "2011-07-22",
      "summary": "During World War II, Steve Rogers is a sickly man from Brooklyn who's transformed into super-soldier Captain America to aid in the war effort. Rogers must stop the Red Skull – Adolf Hitler's ruthless head of weaponry, and the leader of an organization that intends to use a mysterious device of untold powers for world domination.",
      "title": "Captain America: The First Avenger"
    },
    {
      "externalId": 1979,
      "character": "Johnny Storm / Human Torch",
      "language": "en",
      "releaseDate": "2007-06-13",
      "summary": "The Fantastic Four return to the big screen as a new and all powerful enemy threatens the Earth. The seemingly unstoppable 'Silver Surfer', but all is not what it seems and there are old and new enemies that pose a greater threat than the intrepid superheroes realize.",
      "title": "Fantastic Four: Rise of the Silver Surfer"
    }
  ],
  "moviesPlayed": 13,
  "differentCharacters": 2,
  "characters": ["Steve Rogers / Captain America", "Johnny Storm / Human Torch"]
}
```

### **GET /actor/common-characters**

Specify a list of actors and look for common Marvel characters between them. Will return a list of characters that at least two different actors have played.

#### _Example_

- Request (cURL)

```bash
curl --location --request GET 'http://localhost:8080/actor/common-characters?actors=Chris Evans&actors=Michael B. Jordan'
```

- Response (JSON)

```json
[
  {
    "character": "Johnny Storm / Human Torch",
    "actors": ["Chris Evans", "Michael B. Jordan"]
  }
]
```

#### _Example (All Actors)_

As a bonus, here is a request using all the provided Marvel Actors:

```bash
curl --location --request GET 'http://localhost:8080/actor/common-characters?actors=Robert Downey Jr.&actors=Chris Evans&actors=Mark Ruffalo&actors=Chris Hemsworth&actors=Scarlett Johansson&actors=Jeremy Renner&actors=Don Cheadle&actors=Paul Rudd&actors=Brie Larson&actors=Michael B. Jordan&actors=Karen Gillan&actors=Danai Gurira&actors=Josh Brolin&actors=Gwyneth Paltrow&actors=Bradley Cooper&actors=Tom Holland&actors=Zoe Saldana&actors=Anthony Mackie&actors=Tom Hiddleston&actors=Chris Pratt&actors=Black Panther&actors=Samuel L. Jackson&actors=Dave Bautista'
```
