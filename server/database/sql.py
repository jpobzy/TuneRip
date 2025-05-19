from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, CHAR

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Person(Base):
    __tablename__ = "people"

    ssn = Column("ssn", Integer, primary_key=True)
    firstname = Column("firstname", String)
    lastname = Column("lastname", String)
    gender = Column("gender", CHAR)
    age = Column("age", Integer)

    def __init__(self, ssn, firstname, lastname, gender, age):
        self.ssn = ssn
        self.firstname = firstname
        self.lastname = lastname
        self.gender = gender
        self.age = age


    def __repr__(self): # the format of what gets printed
        return f'({self.ssn}) {self.firstname} {self.lastname} ({self.gender}, {self.age})'


class Thing(Base):
    __tablename__ = 'things'
    tid = Column('tid', Integer, primary_key=True)
    description = Column('description', String)
    owner = Column(Integer, ForeignKey('people.ssn'))

    def __init__(self, tid, description, owner):
        self.tid = tid
        self.description = description
        self.owner = owner

    def __repr__(self):
        return f'({self.tid}) {self.description} owned by {self.owner}'
    




engine =  create_engine("sqlite:///mydb.db", echo=True)
Base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)
session = Session()
# person = Person(12312, 'Mike', 'Smith', "m", 35)
# session.add(person)
# session.commit()

p1 = Person(32765, 'Jon', 'take', "m", 55)
p2 = Person(543543, 'Jake', 'cool', "m", 20)
p3 = Person(76575, 'Nitin', 'Pai', "m", 22)

session.add(p1)
session.add(p2)
session.add(p3)
session.commit()


# FILTERING:

# results = session.query(Person).all()
# results = session.query(Person).filter(Person.firstname == 'Anna')
# results = session.query(Person).filter(Person.age > 30)
# results = session.query(Person).filter(Person.firstname.like('%An%'))
# results = session.query(Person).filter(Person.firstname.in_(['Anna', 'Jake']))
# for r in results:
#     print(r)


# results = session.query(Person).filter(Person.firstname == 'Anna')
# for r in results:
#     print(r)

t1 = Thing(1, 'car', p1.ssn)
session.add(t1)

session.commit()