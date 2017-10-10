#==================================
# Run as root
# Imaginary bank private schema 
#==================================
drop database if exists acmebank;

create database acmebank;

use acmebank;

drop table if exists salary;
create table salary (
  id int unsigned auto_increment not null primary key,
  name varchar(40) not null,
  salary int not null,
  dob date not null
  ); 

insert into salary() values(null, 'Alice', 10000,  date_format('1990-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Bob', 20000,  date_format('1991-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Carol', 30000,  date_format('1992-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Dave', 4000,  date_format('1993-02-23', '%Y-%m-%d'));

drop table if exists cyberFraud;
create table cyberFraud (
  id int unsigned auto_increment not null primary key,
  amount int not null,
  ipAddress int unsigned null,
  incidentDate datetime not null
  ); 
  
drop procedure if exists `insert_bulk_cyberfraud_data`;

delimiter //
CREATE DEFINER=`root`@`%` PROCEDURE `insert_bulk_cyberfraud_data`(IN rowCount int, IN ipAddress varchar(15))
BEGIN
    DECLARE i int DEFAULT 0;
    WHILE i < rowCount DO

		insert into acmebank.cyberFraud() 
			values(null, FLOOR(RAND() * 100), 
						inet_aton(ipAddress),
						date_format('2016-06-06', '%Y-%m-%d'));
    
        SET i = i + 1;
    END WHILE;
END //
delimiter ;

# Sample data (2017) hand crafted
insert into cyberFraud() values(null, '32', inet_aton('100.200.127.4'), date_format('2017-01-18 15:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('100.200.127.5'), date_format('2017-01-18 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '16', inet_aton('100.200.127.5'), date_format('2017-01-18 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '53', inet_aton('100.200.127.6'), date_format('2017-01-18 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '31', inet_aton('100.200.127.6'), date_format('2017-01-19 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '09', inet_aton('100.200.127.7'), date_format('2017-01-20 18:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '10', inet_aton('100.200.127.8'), date_format('2017-01-20 18:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '20', inet_aton('100.200.127.8'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '30', inet_aton('100.200.127.8'), date_format('2017-01-20 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.1'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.1'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.2'), date_format('2017-01-20 16:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '37', inet_aton('200.200.127.3'), date_format('2017-01-21 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '42', inet_aton('200.200.127.4'), date_format('2017-01-21 14:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '16', inet_aton('200.200.127.4'), date_format('2017-01-21 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '88', inet_aton('200.200.127.5'), date_format('2017-01-21 21:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '99', inet_aton('64.63.87.112'), date_format('2017-02-21 04:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '23', inet_aton('64.63.87.113'), date_format('2017-02-21 04:25:25', '%Y-%m-%d %H:%i:%S'));

insert into cyberFraud() values(null, '32', inet_aton('100.200.127.4'), date_format('2017-01-18 15:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('100.200.127.5'), date_format('2017-01-18 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '16', inet_aton('100.200.127.5'), date_format('2017-01-18 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '53', inet_aton('100.200.127.6'), date_format('2017-01-18 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '31', inet_aton('100.200.127.6'), date_format('2017-01-19 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '09', inet_aton('100.200.127.7'), date_format('2017-01-20 18:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '10', inet_aton('100.200.127.8'), date_format('2017-01-20 18:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '20', inet_aton('100.200.127.8'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '30', inet_aton('100.200.127.8'), date_format('2017-01-20 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.1'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.1'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.2'), date_format('2017-01-20 16:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '37', inet_aton('200.200.127.3'), date_format('2017-01-21 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '42', inet_aton('200.200.127.4'), date_format('2017-01-21 14:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '16', inet_aton('200.200.127.4'), date_format('2017-01-21 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '88', inet_aton('200.200.127.5'), date_format('2017-01-21 21:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '99', inet_aton('64.63.87.112'), date_format('2017-02-21 04:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '23', inet_aton('64.63.87.113'), date_format('2017-02-21 04:25:25', '%Y-%m-%d %H:%i:%S'));

insert into cyberFraud() values(null, '32', inet_aton('100.200.127.4'), date_format('2017-01-18 15:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('100.200.127.5'), date_format('2017-01-18 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '16', inet_aton('100.200.127.5'), date_format('2017-01-18 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '53', inet_aton('100.200.127.6'), date_format('2017-01-18 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '31', inet_aton('100.200.127.6'), date_format('2017-01-19 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '109', inet_aton('100.200.127.7'), date_format('2017-01-20 18:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '10', inet_aton('100.200.127.8'), date_format('2017-01-20 18:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '20', inet_aton('100.200.127.8'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '30', inet_aton('100.200.127.8'), date_format('2017-01-20 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.1'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.1'), date_format('2017-01-20 19:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('200.200.127.2'), date_format('2017-01-20 16:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '37', inet_aton('200.200.127.3'), date_format('2017-01-21 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '42', inet_aton('200.200.127.4'), date_format('2017-01-21 14:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '16', inet_aton('200.200.127.4'), date_format('2017-01-21 23:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '88', inet_aton('200.200.127.5'), date_format('2017-01-21 21:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '99', inet_aton('64.63.87.112'), date_format('2017-02-21 04:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '23', inet_aton('64.63.87.113'), date_format('2017-02-21 04:25:25', '%Y-%m-%d %H:%i:%S'));

# Sample data (2016) bulk
call insert_bulk_cyberfraud_data(100, '100.200.127.5');
call insert_bulk_cyberfraud_data(100, '100.200.127.7');
call insert_bulk_cyberfraud_data(100, '100.200.127.8');
call insert_bulk_cyberfraud_data(100, '200.200.127.2');
call insert_bulk_cyberfraud_data(100, '200.200.127.4');
call insert_bulk_cyberfraud_data(100, '200.200.127.5');
call insert_bulk_cyberfraud_data(100, '99.99.99.99');

#=================================================================
# Schema to hold read only views, access from analytics engine.
#=================================================================
drop view if exists v_salary;

create algorithm = temptable 
  sql security definer
  view v_salary as select * from salary;

drop view if exists v_cyberFraud;

create algorithm = temptable
 sql security definer
 view v_cyberFraud as select * from cyberFraud;

drop user if exists 'spdzuser_bank'@'172.0.0.0/255.0.0.0' ;
create user 'spdzuser_bank'@'172.0.0.0/255.0.0.0' 
 identified by 'bankpassword' password expire never;


grant select on v_salary to 'spdzuser_bank'@'172.0.0.0/255.0.0.0' ;

grant select on v_cyberFraud to 'spdzuser_bank'@'172.0.0.0/255.0.0.0' ;

commit;







