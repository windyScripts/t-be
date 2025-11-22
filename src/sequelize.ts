import { Sequelize} from 'sequelize';

export const sequelize = new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USERNAME || '', process.env.MYSQL_PASSWORD || '', {
  host: 'localhost',
  dialect: 'mysql'
});