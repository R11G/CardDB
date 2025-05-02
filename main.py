from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, func, Integer
import os
import mysql.connector
import base64
import requests
import io
from urllib.parse import unquote
from pokemontcgsdk import Card, Set, RestClient
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
RestClient.configure('3751dc90-a972-4cf1-8dfe-dc3104084202')
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="root",
    password="cookiemonster",
    hostname="127.0.0.1:3306",
    databasename="cards",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'isolation_level': 'READ COMMITTED'
}
db = SQLAlchemy(app)
def get_db_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        port="3306",
        user="root",
        password="cookiemonster",
        database="cards"
    )
class BaseModel(db.Model):
    __abstract__ = True

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class myCard(BaseModel):
    __tablename__ = "card"
    card_id = db.Column(db.String(50), primary_key=True)
    artist = db.Column(db.Text)
    ancient_trait_name = db.Column(db.Text)
    ancient_trait_text = db.Column(db.Text)
    retreat = db.Column(db.Integer)
    evolves = db.Column(db.Text)
    text = db.Column(db.Text)
    hp = db.Column(db.Integer)
    regulation = db.Column(db.String(1))
    name = db.Column(db.Text)
    number = db.Column(db.Text)
    rarity = db.Column(db.Text)
    supertype = db.Column(db.Text)
    types = db.relationship('myType', secondary='typerel', back_populates='cards')
    weaknesses = db.relationship('myType', secondary='weaknessrel', back_populates='cards')
    reslink = db.relationship('myResistanceRel', back_populates='card')
    abilities = db.relationship('myAbility',  back_populates='card')
    attacks = db.relationship('myAttack',  back_populates='card')
    set = db.relationship('mySet', secondary='setrel', back_populates='cards')
    image = db.relationship('myCardImage',  back_populates='card')
    legal = db.relationship('myLegality', secondary='legalityrel', back_populates='cards')
    rules = db.relationship('myRules',  back_populates='card')
    subtypes = db.relationship('mySubtype', secondary='subtyperel', back_populates='cards')
class myAbility(BaseModel):
    __tablename__ = "ability"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    text = db.Column(db.Text)
    card = db.relationship('myCard',  back_populates='abilities')
class myAttack(BaseModel):
    __tablename__ = "attack"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    cost = db.Column(db.String(10))
    damage = db.Column(db.Integer)
    text = db.Column(db.Text)
    card = db.relationship('myCard',  back_populates='attacks')
class mySet(BaseModel):
    __tablename__ = "card_set"
    set_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.Text)
    print_total = db.Column(db.Integer)
    total = db.Column(db.Integer)
    release_date = db.Column(db.Date)
    series = db.Column(db.Text)
    ptcgoCode = db.Column(db.Text)
    cards = db.relationship('myCard', secondary='setrel', back_populates='set')
    legal = db.relationship('myLegality', secondary='setlegalityrel', back_populates='sets')
class myCardImage(BaseModel):
    __tablename__ = "cardimage"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    image = db.Column(db.LargeBinary)
    card = db.relationship('myCard',  back_populates='image')
class myLR(BaseModel):
    __tablename__ = "legalityrel"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    format_id = db.Column(db.Integer, db.ForeignKey('legality.format_id'), primary_key=True)
class myResistanceRel(BaseModel):
    __tablename__ = "resistancerel"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.type_id'), primary_key=True)
    value = db.Column(db.Integer)
    card = db.relationship('myCard', back_populates='reslink')
    resistance = db.relationship('myType', back_populates='reslink')
class myWeaknessRel(BaseModel):
    __tablename__ = "weaknessrel"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.type_id'), primary_key=True)
class myTypeRel(BaseModel):
    __tablename__ = "typerel"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    type_id = db.Column(db.Integer, db.ForeignKey('type.type_id'), primary_key=True)
class mySubtypeRel(BaseModel):
    __tablename__ = "subtyperel"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    subtype_id = db.Column(db.Integer, db.ForeignKey('subtype.subtype_id'), primary_key=True)
class myRules(BaseModel):
    __tablename__ = "rules"
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    card = db.relationship('myCard',  back_populates='rules')
class mySetRel(BaseModel):
    __tablename__ = "setrel"
    set_id = db.Column(db.String(50), db.ForeignKey('card_set.set_id'), primary_key=True)
    card_id = db.Column(db.String(50), db.ForeignKey('card.card_id'), primary_key=True)
class myType(BaseModel):
    __tablename__ = "type"
    type_id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Text)
    abbr = db.Column(db.String(1))
    cards = db.relationship('myCard', secondary='typerel', back_populates='types')
    weaks = db.relationship('myCard', secondary='weaknessrel', back_populates='weaknesses')
    reslink = db.relationship('myResistanceRel', back_populates='resistance')
class mySubtype(BaseModel):
    __tablename__ = "subtype"
    subtype_id = db.Column(db.Integer, primary_key=True)
    subtype = db.Column(db.Text)
    cards = db.relationship('myCard', secondary='subtyperel', back_populates='subtypes')
class mySLR(BaseModel):
    __tablename__ = "setlegalityrel"
    set_id = db.Column(db.String(50), db.ForeignKey('card_set.set_id'), primary_key=True)
    format_id = db.Column(db.Integer, db.ForeignKey('legality.format_id'), primary_key=True)
class myLegality(BaseModel):
    __tablename__ = "legality"
    format_id = db.Column(db.Integer, primary_key=True)
    format = db.Column(db.Text)
    cards = db.relationship('myCard', secondary='legalityrel', back_populates='legal')
    sets = db.relationship('mySet', secondary='setlegalityrel', back_populates='legal')
@app.route("/<set_id>")
def main(set_id):
    sets = Card.find(set_id)
    return jsonify(sets)
@app.route("/addsetcard/<set_id>")  
def addsetcard(set_id):
    cards = Card.where(q=f'set.id:{set_id}')
    if cards:
        try:
            for card in cards:
                if not myCard.query.get(card.id):
                    record = myCard(
                        card_id = card.id,
                        artist = card.artist,
                        ancient_trait_name = card.ancientTrait.name if card.ancientTrait else None,
                        ancient_trait_text = card.ancientTrait.text if card.ancientTrait else None,
                        retreat = card.convertedRetreatCost,
                        evolves = card.evolvesFrom,
                        text = card.flavorText,
                        hp = int(card.hp) if card.hp and card.hp.strip().isdigit() else None,
                        regulation = card.regulationMark,
                        name = card.name,
                        number = card.number,
                        rarity = card.rarity,
                        supertype = card.supertype
                    )
                    db.session.add(record)
                    set = mySetRel(card_id= card.id,
                                    set_id=card.set.id)
                    db.session.add(set)
                    response = requests.get(card.images.small)
                    if response.status_code == 200:
                        image = response.content
                    else:
                        image = None
                    img = myCardImage(card_id=card.id,
                                    image = image)
                    db.session.add(img)
                    counter = 1 #id number for rules, abilities and attacks
                    for name, value in card.legalities.__dict__.items():
                        if (value == "Legal"):
                            legality = myLegality.query.filter_by(format=name).first()
                            if legality:
                                add = myLR(card_id= card.id,
                                            format_id=legality.format_id)
                                db.session.add(add)
                    if card.attacks:
                        for attack in card.attacks:
                            scost = ''
                            if attack.cost:
                                for cost in attack.cost:
                                    if (cost == "Free"):
                                        scost = scost + '-'
                                    else:
                                        type = myType.query.filter_by(type=cost).first()
                                        scost = scost + type.abbr
                            add = myAttack(card_id= card.id,
                                            id = counter,
                                            name = attack.name,
                                            text = attack.text,
                                            damage = int(attack.damage) if attack.damage and attack.damage.strip().isdigit() else None,
                                            cost = scost)
                            db.session.add(add)
                            counter+=1
                        counter = 1
                    if card.rules:
                        for rule in card.rules:
                            add = myRules(card_id= card.id,
                                            id = counter,
                                            text = rule)
                            db.session.add(add)
                            counter+=1
                        counter = 1
                    if card.resistances:
                        for resistance in card.resistances:
                            type = myType.query.filter_by(type=resistance.type).first()
                            add = myResistanceRel(card_id= card.id,
                                                    type_id = type.type_id,
                                                    value = abs(int(resistance.value)))
                            db.session.add(add)
                    if card.weaknesses:
                        for weakness in card.weaknesses:
                            type = myType.query.filter_by(type=weakness.type).first()
                            add = myWeaknessRel(card_id= card.id,
                                                    type_id = type.type_id)
                            db.session.add(add)
                    if card.types:
                        for type in card.types:
                            type = myType.query.filter_by(type=type).first()
                            add = myTypeRel(card_id= card.id,
                                                    type_id = type.type_id)
                            db.session.add(add)
                    if card.subtypes:
                        for subtype in card.subtypes:
                            subtype = mySubtype.query.filter_by(subtype=subtype).first()
                            add = mySubtypeRel(card_id= card.id,
                                                    subtype_id = subtype.subtype_id)
                            db.session.add(add)
                    if card.abilities:
                        for ability in card.abilities:
                            add = myAbility(card_id= card.id,
                                            id = counter,
                                            name = ability.name,
                                            text = ability.text)
                            db.session.add(add)
                            counter+=1
                db.session.commit()
            return jsonify({'message': 'Data stored successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}) 
#automate single card add
@app.route("/addcard/<card_id>")
def addcard(card_id):
    card = Card.find(card_id)
    if card:
        try:
            if not myCard.query.get(card.id):
                record = myCard(
                    card_id = card.id,
                    artist = card.artist,
                    ancient_trait_name = card.ancientTrait.name if card.ancientTrait else None,
                    ancient_trait_text = card.ancientTrait.text if card.ancientTrait else None,
                    retreat = card.convertedRetreatCost,
                    evolves = card.evolvesFrom,
                    text = card.flavorText,
                    hp = int(card.hp) if card.hp and card.hp.strip().isdigit() else None,
                    regulation = card.regulationMark,
                    name = card.name,
                    number = card.number,
                    rarity = card.rarity,
                    supertype = card.supertype
                )
                db.session.add(record)
                response = requests.get(card.images.small)
                if response.status_code == 200:
                    image = response.content
                else:
                    image = None
                img = myCardImage(card_id=card.id,
                image = image)
                db.session.add(img)
                set = mySetRel(card_id= card.id,
                                set_id=card.set.id)
                db.session.add(set)
                for name, value in card.legalities.__dict__.items():
                    if (value == "Legal"):
                        legality = myLegality.query.filter_by(format=name).first()
                        if legality:
                            add = myLR(card_id= card.id,
                                        format_id=legality.format_id)
                            db.session.add(add)
                counter = 1 #id number for rules, abilities and attacks 
                if card.attacks:
                    for attack in card.attacks:
                        scost = ''
                        if attack.cost:
                            for cost in attack.cost:
                                if (cost == "Free"):
                                    scost = scost + '-'
                                else:
                                    type = myType.query.filter_by(type=cost).first()
                                    scost = scost + type.abbr
                        add = myAttack(card_id= card.id,
                                        id = counter,
                                        name = attack.name,
                                        text = attack.text,
                                        damage = int(attack.damage) if attack.damage and attack.damage.strip().isdigit() else None,
                                        cost = scost)
                        db.session.add(add)
                        counter+=1
                    counter = 1
                if card.rules:
                    for rule in card.rules:
                        add = myRules(card_id= card.id,
                                        id = counter,
                                        text = rule)
                        db.session.add(add)
                        counter+=1
                    counter = 1
                if card.resistances:
                    for resistance in card.resistances:
                        type = myType.query.filter_by(type=resistance.type).first()
                        add = myResistanceRel(card_id= card.id,
                                                type_id = type.type_id,
                                                value = abs(int(resistance.value)))
                        db.session.add(add)
                if card.weaknesses:
                    for weakness in card.weaknesses:
                        type = myType.query.filter_by(type=weakness.type).first()
                        add = myWeaknessRel(card_id= card.id,
                                                type_id = type.type_id)
                        db.session.add(add)
                if card.types:
                    for type in card.types:
                        type = myType.query.filter_by(type=type).first()
                        add = myTypeRel(card_id= card.id,
                                                type_id = type.type_id)
                        db.session.add(add)
                if card.subtypes:
                    for subtype in card.subtypes:
                        subtype = mySubtype.query.filter_by(subtype=subtype).first()
                        add = mySubtypeRel(card_id= card.id,
                                                subtype_id = subtype.subtype_id)
                        db.session.add(add)
                if card.abilities:
                    for ability in card.abilities:
                        add = myAbility(card_id= card.id,
                                        id = counter,
                                        name = ability.name,
                                        text = ability.text)
                        db.session.add(add)
                        counter+=1
                db.session.commit()
            return jsonify({'message': 'Data stored successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}) 
#automate adding sets
@app.route("/set")
def set():
    sets = Set.where(q='legalities.expanded:legal')
    try:
        for s in sets:
            if not mySet.query.get(s.id):
                record = mySet(
                    set_id= s.id,
                    name= s.name,
                    print_total= s.printedTotal,
                    ptcgoCode= s.ptcgoCode,
                    release_date= s.releaseDate,
                    series= s.series,
                    total= s.total
                )
                db.session.add(record)
                for name, value in s.legalities.__dict__.items():
                    if (value == "Legal"):
                        legality = myLegality.query.filter_by(format=name).first()
                        if legality:
                            add = mySLR(set_id= s.id,
                                        format_id=legality.format_id)
                            db.session.add(add)
        db.session.commit()
        return jsonify({'message': 'Data stored successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)})
@app.route("/cardlist")
def cardlist():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT card.card_id,card.name,card_set.ptcgoCode, card.number FROM card JOIN setrel ON card.card_id = setrel.card_id JOIN card_set ON setrel.set_id = card_set.set_id")
    result = cursor.fetchall()
    data = [{"id": row[0],"name": row[1], "code": row[2], "number": row[3]} for row in result]
    cursor.close()
    conn.close()
    return {"cardlist": data}
@app.route("/setlist")
def setlist():
    sets = mySet.query.all()
    data = [{"id": row.set_id,"name": row.name, "code": row.ptcgoCode} for row in sets]
    return {"setlist": data}
@app.route("/searchname/<name>")
def searchname(name):
    dname = unquote(name)
    cardlist = myCard.query.join(mySetRel).join(mySet).filter(myCard.name.like(f'%{dname}%')).order_by(mySet.release_date, 
                                                                                                       func.cast(func.regexp_replace(myCard.number, '[^0-9]', ''), Integer)).all()
    data = [{"id": c.card_id,
             "code": c.set[0].ptcgoCode if c.set else None,
             "number": c.number} for c in cardlist]
    total = len(data)
    rulebox = myCard.query.join(mySubtypeRel).join(mySubtype).filter(myCard.name.like(f'%{dname}%'),
                                            or_(mySubtype.subtype_id == 6,
                                                mySubtype.subtype_id == 10,
                                                mySubtype.subtype_id == 19,
                                                mySubtype.subtype_id == 20,
                                                mySubtype.subtype_id == 37,
                                                mySubtype.subtype_id == 38,
                                                mySubtype.subtype_id == 39,
                                                mySubtype.subtype_id == 40,
                                                mySubtype.subtype_id == 41,)).distinct(myCard.card_id).count()
    rare = myCard.query.filter(myCard.name.like(f'%{dname}%'), 
                               myCard.rarity.notin_(['Common', 'Uncommon', 'Rare', 'Rare Holo'])).distinct(myCard.card_id).count()
    return {"cardlist": data, "total": total, "rulebox": rulebox, "rare": rare}
@app.route("/searchhp")
def searchhp():
    min = request.args.get('min', type=int)
    max = request.args.get('max', type=int)
    cards = myCard.query.join(mySetRel).join(mySet).filter(myCard.hp.between(min,max)).order_by(mySet.release_date, 
                                                                                                       func.cast(func.regexp_replace(myCard.number, '[^0-9]', ''), Integer)).all()
    data = [{"id": c.card_id,
             "code": c.set[0].ptcgoCode if c.set else None,
             "number": c.number} for c in cards]
    total = len(data)
    rulebox = myCard.query.join(mySubtypeRel).join(mySubtype).filter(myCard.hp.between(min,max),
                                            or_(mySubtype.subtype_id == 6,
                                                mySubtype.subtype_id == 10,
                                                mySubtype.subtype_id == 19,
                                                mySubtype.subtype_id == 20,
                                                mySubtype.subtype_id == 37,
                                                mySubtype.subtype_id == 38,
                                                mySubtype.subtype_id == 39,
                                                mySubtype.subtype_id == 40,
                                                mySubtype.subtype_id == 41,)).distinct(myCard.card_id).count()
    rare = myCard.query.filter(myCard.hp.between(min,max), 
                               myCard.rarity.notin_(['Common', 'Uncommon', 'Rare', 'Rare Holo'])).distinct(myCard.card_id).count()
    return {"cardlist": data, "total": total, "rulebox": rulebox, "rare": rare}
@app.route("/searchset/<set>")
def searchset(set):
    cards = myCard.query.join(mySetRel).join(mySet).filter(mySet.set_id==set).order_by(func.cast(func.regexp_replace(myCard.number, '[^0-9]', ''), Integer)).all()
    data = [{"id": c.card_id,
             "code": c.set[0].ptcgoCode if c.set else None,
             "number": c.number} for c in cards]
    total = len(data)
    rulebox = myCard.query.join(mySetRel).join(mySet).join(mySubtypeRel).join(mySubtype).filter(mySet.set_id==set,
                                            or_(mySubtype.subtype_id == 6,
                                                mySubtype.subtype_id == 10,
                                                mySubtype.subtype_id == 19,
                                                mySubtype.subtype_id == 20,
                                                mySubtype.subtype_id == 37,
                                                mySubtype.subtype_id == 38,
                                                mySubtype.subtype_id == 39,
                                                mySubtype.subtype_id == 40,
                                                mySubtype.subtype_id == 41,)).distinct(myCard.card_id).count()
    rare = myCard.query.join(mySetRel).join(mySet).filter(mySet.set_id==set,
                                                          myCard.rarity.notin_(['Common', 'Uncommon', 'Rare', 'Rare Holo'])).distinct(myCard.card_id).count()
    return {"cardlist": data, "total": total, "rulebox": rulebox, "rare": rare}
@app.route("/getimage/<id>")
def getimage(id):
    img = myCardImage.query.get(id)
    return send_file(
        io.BytesIO(img.image),
        mimetype='image/jpeg',
        as_attachment=False
    )
@app.route("/card/<card_id>", methods=["GET", "DELETE", "PUT", "PATCH"])
def card(card_id):
    if request.method == "GET":
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""SELECT card.card_id, card.artist, card.ancient_trait_name, card.ancient_trait_text, card.retreat, card.evolves, card.text, card.hp, card.regulation, card.name, card.number, card.rarity, card.supertype, card_set.name, card_set.ptcgoCode, cardimage.image 
        FROM card NATURAL JOIN cardimage NATURAL JOIN setrel JOIN card_set ON setrel.set_id = card_set.set_id
        WHERE card.card_id = %s""", (card_id,))
        row = cursor.fetchone()
        data = {"id": row[0],
                 "artist": row[1],
                 "atname": row[2],
                 "attext": row[3],
                 "retreat": row[4],
                 "evolves": row[5],
                 "ftext": row[6],
                 "hp": row[7],
                 "reg": row[8],
                 "name": row[9],
                 "number": row[10],
                 "rarity": row[11],
                 "supertype": row[12],
                 "setname": row[13],
                 "code": row[14],
                 "image": base64.b64encode(row[15]).decode("utf-8") if row[15] else None,
                 "type": [],
                 "weakness": [],
                 "resistance": [],
                 "subtype": [],
                 "ability": [],
                 "attack": [],
                 "rules": [],
                 "formats": []}
        cursor.execute("SELECT type_id, type FROM card NATURAL JOIN typerel NATURAL JOIN type WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        types = [{"id": row[0], "type": row[1]} for row in result]
        data["type"] = types
        cursor.execute("SELECT type_id, type FROM card NATURAL JOIN weaknessrel NATURAL JOIN type WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        types = [{"id": row[0], "type": row[1]} for row in result]
        data["weakness"] = types
        cursor.execute("SELECT type_id, type, value FROM card NATURAL JOIN resistancerel NATURAL JOIN type WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        types = [{"id": row[0], "type": row[1], "value": row[2]} for row in result]
        data["resistance"] = types
        cursor.execute("SELECT subtype_id, subtype FROM card NATURAL JOIN subtyperel NATURAL JOIN subtype WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        types = [{"id": row[0], "subtype": row[1]} for row in result]
        data["subtype"] = types
        cursor.execute("SELECT ability.id, ability.name, ability.text FROM card JOIN ability ON card.card_id = ability.card_id WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        clist = [{"id": row[0], "name": row[1], "text": row[2]} for row in result]
        data["ability"] = clist
        cursor.execute("SELECT attack.id, attack.name, attack.cost, attack.damage, attack.text FROM card JOIN attack ON card.card_id = attack.card_id WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        clist = [{"id": row[0], "name": row[1], "cost": row[2], "damage": row[3], "text": row[4]} for row in result]
        data["attack"] = clist
        cursor.execute("SELECT id, rules.text FROM card JOIN rules ON card.card_id = rules.card_id WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        clist = [{"id": row[0], "text": row[1]} for row in result]
        data["rules"] = clist
        cursor.execute("SELECT format_id FROM card NATURAL JOIN legalityrel NATURAL JOIN legality WHERE card.card_id = %s", (card_id,))
        result = cursor.fetchall()
        clist = [row[0] for row in result]
        data["formats"] = clist
        cursor.execute("SELECT type_id, type FROM type")
        result = cursor.fetchall()
        typelist = [{"id": row[0], "type": row[1]} for row in result]
        cursor.execute("SELECT subtype_id, subtype FROM subtype")
        result = cursor.fetchall()
        subtypelist = [{"id": row[0], "subtype": row[1]} for row in result]
        cursor.execute("SELECT format_id, format FROM legality")
        result = cursor.fetchall()
        formatlist = [{"id": row[0], "format": row[1]} for row in result]
        cursor.close()
        conn.close()
        return {"card": data, "types": typelist, "subtypes": subtypelist, "formats": formatlist}
    elif request.method == "PATCH":
        conn = get_db_connection()
        cursor = conn.cursor(prepared=True)
        conn.autocommit = False
        conn.start_transaction()
        storage = request.get_json()
        base64_image = storage.get('image', "")
        if base64_image:
            image_data = base64.b64decode(base64_image)
        else:
            image_data = None
        card = [
                "artist",
                "atname",
                "attext",
                "retreat",
                "evolves",
                "ftext",
                "hp",
                "reg",
                "name",
                "rarity",
                "supertype"
            ]
        cmap = {
            "reg": "regulation",
            "atname": "ancient_trait_name",
            "attext": "ancient_trait_text",
            "ftext": "text"
        }
        filtered_data = {k: (v if v != "" else None) for k, v in storage.items() if k in card}
        if (filtered_data):
            updated_filtered_data = {cmap.get(k, k): v for k, v in filtered_data.items()}
            set = ', '.join(f"{k} = %s" for k in updated_filtered_data.keys())
            values = list(updated_filtered_data.values())
            values.append(card_id)
            insert_query = f"UPDATE card SET {set} WHERE card_id = %s"
            cursor.execute(insert_query, tuple(values))
        if (image_data):
            insert_image = """
            UPDATE cardimage SET image = %s 
            WHERE card_id = %s
            """
            cursor.execute(insert_image, (image_data, card_id))
        attacks = storage.get("attack", [])
        for attack_counter, attack in enumerate(attacks, start=1):
            atk = [
                "name",
                "cost",
                "damage",
                "text"
            ]
            filtered_data = {k: (v if v != "" else None) for k, v in attack.items() if k in atk}
            set = ', '.join(f"{k} = %s" for k in filtered_data.keys())
            values = list(filtered_data.values())
            values.append(attack.get("id",0))
            values.append(card_id)
            attack_query = f"""
            UPDATE attack SET {set} WHERE id = %s AND card_id = %s
            """
            cursor.execute(attack_query, tuple(values))
        abilities = storage.get("ability",[])
        for count, ability in enumerate(abilities, start=1):
            ab = ["name", "text"]
            filtered_data = {k: (v if v != "" else None) for k, v in ability.items() if k in ab}
            set = ', '.join(f"{k} = %s" for k in filtered_data.keys())
            values = list(filtered_data.values())
            values.append(ability.get("id",0))
            values.append(card_id)
            ability_query = f"""
            UPDATE ability SET {set} WHERE id = %s AND card_id = %s
            """
            cursor.execute(ability_query, tuple(values))
        rules = storage.get("rules", [])
        for count, rule in enumerate(rules, start=1):
            ab = ["text"]
            filtered_data = {k: (v if v != "" else None) for k, v in rule.items() if k in ab}
            set = ', '.join(f"{k} = %s" for k in filtered_data.keys())
            values = list(filtered_data.values())
            values.append(rule.get("id",0))
            values.append(card_id)
            up_rule = f"""
            UPDATE rules SET {set} WHERE id = %s AND card_id = %s
            """
            cursor.execute(up_rule, tuple(values))
        weaks = storage.get("weakness", [])
        if (weaks):
            cursor.execute("DELETE FROM weaknessrel WHERE card_id = %s", (card_id,))
        for weak in weaks:
            columns = ['card_id', 'type_id']
            values = [card_id, weak.get("id",0)]
            insert = f"""
            INSERT INTO weaknessrel ({', '.join(columns)}) 
            VALUES ({', '.join(['%s'] * len(values))})
            """
            cursor.execute(insert, tuple(values))
        resis = storage.get("resistance", [])
        if (resis):
            cursor.execute("DELETE FROM resistancerel WHERE card_id = %s", (card_id,))
        for resi in resis:
            columns = ['card_id', 'type_id', 'value']
            values = [card_id, resi.get("id", 0), resi.get("value", 0)]
            insert = f"""
            INSERT INTO resistancerel ({', '.join(columns)}) 
            VALUES ({', '.join(['%s'] * len(values))})
            """
            cursor.execute(insert, tuple(values))
        types = storage.get("type", [])
        if (types):
            cursor.execute("DELETE FROM typerel WHERE card_id = %s", (card_id,))
        for type in types:
            columns = ['card_id', 'type_id']
            values = [card_id, type.get("id",0)]
            insert = f"""
            INSERT INTO typerel ({', '.join(columns)}) 
            VALUES ({', '.join(['%s'] * len(values))})
            """
            cursor.execute(insert, tuple(values))
        subtypes = storage.get("subtype", [])
        if (subtypes):
            cursor.execute("DELETE FROM subtyperel WHERE card_id = %s", (card_id,))
        for subtype in subtypes:
            columns = ['card_id', 'subtype_id']
            values = [card_id, subtype.get("id",0)]
            insert = f"""
            INSERT INTO subtyperel ({', '.join(columns)}) 
            VALUES ({', '.join(['%s'] * len(values))})
            """
            cursor.execute(insert, tuple(values))
        formats = storage.get("formats", [])
        if (formats):
            cursor.execute("DELETE FROM legalityrel WHERE card_id = %s", (card_id,))
        for form in formats:
            columns = ['card_id', 'format_id']
            values = [card_id, form]
            insert = f"""
            INSERT INTO legalityrel ({', '.join(columns)}) 
            VALUES ({', '.join(['%s'] * len(values))})
            """
            cursor.execute(insert, tuple(values))
        response = {
            'message': 'Updated'
        }
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify(response), 200
    
    elif request.method == "DELETE":
        conn = get_db_connection()
        cursor = conn.cursor()
        conn.autocommit = False
        try:
            conn.start_transaction()
            cursor.execute("DELETE FROM card WHERE card_id = %s", (card_id,))
            conn.commit()
        except mysql.connector.Error as err:
            conn.rollback()
            response = {
                'message': 'Deletion Failed'
            }
            cursor.close()
            conn.close()
            return jsonify(response), 404
        cursor.close()
        conn.close()
        response = {
            'message': 'Deleted'
        }
        return jsonify(response), 200
    elif request.method == "PUT":
        conn = get_db_connection()
        cursor = conn.cursor(prepared=True)
        conn.autocommit = False
        try:
            conn.start_transaction()
            storage = request.get_json()
            base64_image = storage.get('image', "")  # Get the base64 image
            if base64_image:
                # Decode the base64 string to binary data
                image_data = base64.b64decode(base64_image)
            else:
                image_data = None
            card = [
                "artist",
                "ancient_trait_name",
                "ancient_trait_text",
                "retreat",
                "evolves",
                "text",
                "hp",
                "regulation",
                "name",
                "number",
                "rarity",
                "supertype"
            ]
            filtered_data = {k: v for k, v in storage.items() if k in card and v != ""}
            filtered_data["card_id"] = card_id
            columns = ', '.join(filtered_data.keys())
            values = ', '.join(["%s"] * len(filtered_data))
            insert_query = f"INSERT INTO card ({columns}) VALUES ({values})"
            conn.start_transaction()
            cursor.execute(insert_query, tuple(filtered_data.values()))
            if (image_data):
                insert_image = """
                INSERT INTO cardimage (card_id, image) 
                VALUES (%s, %s)
                """
            cursor.execute(insert_image, (card_id, image_data))
            attacks = storage.get("attack", [])
            for attack_counter, attack in enumerate(attacks, start=1):
                name = attack.get("name", "")
                cost = attack.get("cost", "")
                damage = attack.get("damage", 0)
                text = attack.get("text", "")
                columns = ['card_id', 'id']
                values = [card_id, attack_counter]
                if name:
                    columns.append('name')
                    values.append(name)
                if cost:
                    columns.append('cost')
                    values.append(cost)
                if damage:
                    columns.append('damage')
                    values.append(damage)
                if text:
                    columns.append('text')
                    values.append(text)
                insert_attack_query = f"""
                INSERT INTO attack ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert_attack_query, tuple(values))
            abilities = storage.get("ability",[])
            for count, ability in enumerate(abilities, start=1):
                name = ability.get("name", "")
                text = ability.get("text", "")
                columns = ['card_id', 'id']
                values = [card_id, count]
                if name:
                    columns.append('name')
                    values.append(name)
                if text:
                    columns.append('text')
                    values.append(text)
                insert_ability = f"""
                INSERT INTO ability ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert_ability, tuple(values))
            rules = storage.get("rules", [])
            for count, rule in enumerate(rules, start=1):
                columns = ['card_id', 'id', 'text']
                values = [card_id, count, rule]
                insert_rule = f"""
                INSERT INTO rules ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert_rule, tuple(values))
            weaks = storage.get("weakness", [])
            for weak in weaks:
                columns = ['card_id', 'type_id']
                values = [card_id, weak]
                insert = f"""
                INSERT INTO weaknessrel ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert, tuple(values))
            resis = storage.get("resistance", [])
            for resi in resis:
                columns = ['card_id', 'type_id', 'value']
                values = [card_id, resi.get("type", ""), resi.get("value", 0)]
                insert = f"""
                INSERT INTO resistancerel ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert, tuple(values))
            types = storage.get("type_id", [])
            for type in types:
                columns = ['card_id', 'type_id']
                values = [card_id, type]
                insert = f"""
                INSERT INTO typerel ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert, tuple(values))
            subtypes = storage.get("subtype_id", [])
            for subtype in subtypes:
                columns = ['card_id', 'subtype_id']
                values = [card_id, subtype]
                insert = f"""
                INSERT INTO subtyperel ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert, tuple(values))
            formats = storage.get("format", [])
            for form in formats:
                columns = ['card_id', 'format_id']
                values = [card_id, form]
                insert = f"""
                INSERT INTO legalityrel ({', '.join(columns)}) 
                VALUES ({', '.join(['%s'] * len(values))})
                """
                cursor.execute(insert, tuple(values))
            columns = ['card_id', 'set_id']
            values = [card_id, storage.get("set_id", "")]
            insert = f"""
            INSERT INTO setrel ({', '.join(columns)}) 
            VALUES ({', '.join(['%s'] * len(values))})
            """
            cursor.execute(insert, tuple(values))
        except mysql.connector.Error as err:
            response = {
                'message': 'Failed to Insert'
            }
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify(response), 204
        conn.commit()
        cursor.close()
        conn.close()
        response = {
            'message': 'Created'
        }
        return jsonify(response), 200
@app.route("/insert")
def insert():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT type_id,type FROM type")
    types_result = cursor.fetchall()
    types = [{"id": row[0], "name": row[1]} for row in types_result]
    cursor.execute("SELECT set_id, name, ptcgoCode FROM card_set")
    result = cursor.fetchall()
    sets = [{"id": row[0],"name": row[1], "code": row[2]} for row in result]
    cursor.execute("SELECT subtype_id, subtype FROM subtype")
    result = cursor.fetchall()
    subtypes = [{"id": row[0], "name": row[1]} for row in result]
    cursor.execute("SELECT format_id, format FROM legality")
    result = cursor.fetchall()
    formats = [{"id": row[0], "name": row[1]} for row in result]
    cursor.close()
    conn.close()
    return {"set": sets, "type": types,
            "subtype": subtypes, "format": formats}