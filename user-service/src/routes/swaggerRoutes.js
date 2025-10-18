const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: process.env.SWAGGER_TITLE || 'PawPal User Service API',
    version: process.env.SWAGGER_VERSION || '1.0.0',
    description: process.env.SWAGGER_DESCRIPTION || 'Microservice for managing users and dogs in the PawPal platform',
    contact: {
      name: 'PawPal Team',
      email: 'team@pawpal.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-url.com' 
        : `http://localhost:${process.env.PORT || 3001}`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Unauthorized'
                },
                message: {
                  type: 'string',
                  example: 'Access token is missing or invalid'
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Validation Error'
                },
                message: {
                  type: 'string',
                  example: 'Invalid input data'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email'
                      },
                      message: {
                        type: 'string',
                        example: 'Email is required'
                      },
                      value: {
                        type: 'string',
                        example: ''
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'Resource not found'
                }
              }
            }
          }
        }
      },
      ConflictError: {
        description: 'Resource conflict',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                message: {
                  type: 'string',
                  example: 'Resource already exists'
                }
              }
            }
          }
        }
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Internal Server Error'
                },
                message: {
                  type: 'string',
                  example: 'An unexpected error occurred'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                },
                path: {
                  type: 'string',
                  example: '/api/users'
                },
                method: {
                  type: 'string',
                  example: 'GET'
                }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Users',
      description: 'User management operations'
    },
    {
      name: 'Dogs',
      description: 'Dog management operations'
    },
    {
      name: 'Health',
      description: 'Health check operations'
    }
  ]
};

// Options for the swagger docs
const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/userRoutes.js',
    './src/routes/dogRoutes.js',
    './src/app.js'
  ]
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Swagger UI options
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PawPal User Service API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
};

// Serve swagger.json
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Additional documentation endpoints
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Swagger Documentation',
    timestamp: new Date().toISOString(),
    version: swaggerDefinition.info.version
  });
});

module.exports = router;
