process.env.NODE_ENV = 'test'
process.env.PORT = '3333'
process.env.DATABASE_URL = 'postgresql://docker:docker@localhost:55432/findafriend?schema=public'
process.env.JWT_SECRET = 'findafriend-dev-secret'
