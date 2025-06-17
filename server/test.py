import sqlite3
con = sqlite3.connect("tutorial.db")
cur = con.cursor()


# # create table
# cur.execute("CREATE TABLE movie(title, year, score)")


# # grab table name
# res = cur.execute("SELECT name FROM sqlite_master")
# res.fetchone()
# # ('movie',)



# # select item from table
# res = cur.execute("SELECT name FROM sqlite_master WHERE name='spam'")
# res.fetchone() is None
# # True


# # insert into table
# cur.execute("""
#     INSERT INTO movie VALUES
#         ('Monty Python and the Holy Grail', 1975, 8.2),
#         ('And Now for Something Completely Different', 1971, 7.5)
# """)
# con.commit()

# #  print all scores
# res = cur.execute("SELECT score FROM movie")
# print(res.fetchall())


# # insert multiple records at once 
# data = [
#     ("Monty Python Live at the Hollywood Bowl", 1982, 7.9),
#     ("Monty Python's The Meaning of Life", 1983, 7.5),
#     ("Monty Python's Life of Brian", 1979, 8.0),
# ]
# cur.executemany("INSERT INTO movie VALUES(?, ?, ?)", data)
# con.commit()  # Remember to commit the transaction after executing INSERT.

# # print all records
# for row in cur.execute("SELECT year, title FROM movie ORDER BY year"):
#     print(row)


# # close the connection to ensure its records are written in the db
# con.close()
# new_con = sqlite3.connect("tutorial.db")
# new_cur = new_con.cursor()
# res = new_cur.execute("SELECT title, year FROM movie ORDER BY score DESC")
# title, year = res.fetchone()
# print(f'The highest scoring Monty Python movie is {title!r}, released in {year}')
# new_con.close()

# con.execute("DELETE FROM tracks;")
# con.commit()




