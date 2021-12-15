import { object } from 'joi';

const swaggerDocument = {
  swagger: '2.0',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/actor/': {
      get: {
        summary: 'Search for an actor and look at their info',
        description:
          'We use the query parameter to search for the actor specified. Once found, we return their movies and information.',
        tags: ['Actor'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            type: 'string',
            description: 'The search query used to look for the actor',
            example: 'Chris Evans',
          },
        ],
        responses: {
          200: {
            description: "The actor's movie and info",
            schema: {
              $ref: '#/definitions/ActorSummary',
            },
          },
          404: {
            description: 'Actor not found',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Actor not found' },
              },
            },
          },
          422: {
            description: 'Validation Error',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: '"query.query" is required' },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Something went wrong' },
              },
            },
          },
        },
      },
    },
    '/actor/common-characters': {
      get: {
        summary: 'Specify a list of actors and look for common Marvel characters between them',
        tags: ['Actor'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'actors',
            in: 'query',
            required: true,
            type: 'array',
            minItems: 2,
            description: 'List of actors to look for common characters (min: 2)',
            example: ['Chris Evans', 'Michael B. Jordan'],
            collectionFormat: 'multi',
          },
        ],
        responses: {
          200: {
            description: 'A list of characters that at least two different actors have played',
            schema: {
              $ref: '#/definitions/CharacterActor',
            },
          },
          422: {
            description: 'Validation Error',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: '"query.actors" must contain at least 2 items',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Something went wrong' },
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    ActorSummary: {
      properties: {
        name: {
          type: 'string',
          example: 'Chris Evans',
          description: "The actor's name",
        },
        externalId: {
          type: 'number',
          example: 16828,
          description: "The ID used in the external service to fetch the actor's info",
        },
        moviesPlayed: {
          type: 'number',
          example: 2,
          description: 'How many Marvel Movies the actor has played',
        },
        differentCharacters: {
          type: 'number',
          example: 2,
          description: 'How many different Marvel characters the actor has played',
        },
        characters: {
          description: 'List of the Marvel characters this actor played',
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Steve Rogers / Captain America', 'Johnny Storm / Human Torch'],
        },
        movies: {
          type: 'array',
          items: {
            $ref: '#/definitions/Movie',
          },
          example: [
            {
              externalId: 1771,
              character: 'Steve Rogers / Captain America',
              language: 'en',
              releaseDate: '2011-07-22',
              summary:
                "During World War II, Steve Rogers is a sickly man from Brooklyn who's transformed into super-soldier Captain America to aid in the war effort. Rogers must stop the Red Skull – Adolf Hitler's ruthless head of weaponry, and the leader of an organization that intends to use a mysterious device of untold powers for world domination.",
              title: 'Captain America: The First Avenger',
            },
            {
              externalId: 1979,
              character: 'Johnny Storm / Human Torch',
              language: 'en',
              releaseDate: '2007-06-13',
              summary:
                "The Fantastic Four return to the big screen as a new and all powerful enemy threatens the Earth. The seemingly unstoppable 'Silver Surfer', but all is not what it seems and there are old and new enemies that pose a greater threat than the intrepid superheroes realize.",
              title: 'Fantastic Four: Rise of the Silver Surfer',
            },
          ],
        },
      },
    },

    Movie: {
      properties: {
        externalId: {
          type: 'number',
          example: 1979,
          description: "The ID used in the external service to fetch the actor's info",
        },
        character: {
          type: 'string',
          example: 'Johnny Storm / Human Torch',
          description: 'The character played by the actor',
        },
        language: { type: 'string', example: 'en', description: "The Movie's language" },
        releaseDate: {
          type: 'string',
          example: '2007-06-13',
          description: "The Movie's release date",
        },
        summary: {
          type: 'string',
          description: 'A plot synopsis of the movie',
          example:
            "The Fantastic Four return to the big screen as a new and all powerful enemy threatens the Earth. The seemingly unstoppable 'Silver Surfer', but all is not what it seems and there are old and new enemies that pose a greater threat than the intrepid superheroes realize.",
        },
        title: {
          type: 'string',
          example: 'Fantastic Four: Rise of the Silver Surfer',
          description: "The Movie's title",
        },
      },
    },

    CharacterActor: {
      properties: {
        character: {
          type: 'string',
          example: 'Johnny Storm / Human Torch',
        },
        actors: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Chris Evans', 'Michael B. Jordan'],
        },
      },
    },
  },
};

export default swaggerDocument;
