describe spdzAcmeBank.v_salary;

SELECT *  #coluMN_NAME, DATA_TYPE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'v_salary'
  AND table_schema = 'spdzAcmeBank';
  
  SELECT * from mysql.user;

SELECT * FROM mysql.tables_priv;

select * from v_salary;

select * from information_schema.views;

drop user if exists 'spdzuser'@'%' ;