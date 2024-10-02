import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from dotenv import load_dotenv
from os import environ
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
#
app.config['ENV'] = "development" #change to production 
# Load environment variables from corresponding environment files
if app.config["ENV"] == "production":
    load_dotenv("production.env")
else:
    load_dotenv("development.env")
# Configure SQLAlchemy with the database URL
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get("DATABASE_URL") #or "mysql+mysqlconnector://root@127.0.0.1:3306/dtes_database"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable tracking modifications
db = SQLAlchemy(app)


# Malls
class Malls(db.Model):
    __tablename__ = 'malls'
    mall_id = db.Column(db.String(3), primary_key=True, nullable=False)
    mall_name = db.Column(db.String(20), nullable=False)
    
    def __init__(self, mall_id, mall_name):
        self.mall_id = mall_id
        self.mall_name = mall_name
    
@app.route('/get_list_of_malls', methods=['GET'])
def get_list_of_malls():
    # Get list of all malls
    malls = Malls.query.all()
    if malls:
        mall_list = [{'mall_id': mall.mall_id, 'mall_name': mall.mall_name} for mall in malls]
        return jsonify({'malls': mall_list})
    else:
        return jsonify({'message': 'No malls found'}), 404
    
@app.route('/get_mall_data_by_id/<string:mall_id>', methods=['GET'])
def get_mall_data_by_id(mall_id):
    # Get mall data by mall_id
    result = {}
    mall = Malls.query.filter_by(mall_id=mall_id).first()
    if not mall:
        return jsonify({'error': 'Mall not found'}), 404
    result['mall_id'] = mall.mall_id
    result['mall_name'] = mall.mall_name
    # Get total weight of each waste stream
    total_weight = db.session.query(ScannedEntries.waste_id, func.sum(ScannedEntries.weight)).filter_by(mall_id=mall_id).group_by(ScannedEntries.waste_id).all()
    #get waste stream names
    waste_streams = Waste.query.all()
    # Construct a dictionary mapping waste id to total weight
    total_weight_dict = {waste_id: weight for waste_id, weight in total_weight}
    #replace waste id with waste stream name
    for waste in waste_streams:
        if waste.waste_id in total_weight_dict:
            total_weight_dict[waste.waste_stream] = total_weight_dict.pop(waste.waste_id)
    result['mall_waste_stream'] = total_weight_dict

    tenants = Tenants.query.filter_by(mall_id=mall_id).all()
    # Construct a dictionary mapping tenant id to tenant name
    tenant_dict = {tenant.tenant_id: tenant.tenant_name for tenant in tenants}
    result['tenants'] = tenant_dict

    return jsonify(result),200



# Tenants
class Tenants(db.Model):
    __tablename__ = 'tenants'
    tenant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tenant_name = db.Column(db.String(20), nullable=False)
    mall_id = db.Column(db.String(3), db.ForeignKey('malls.mall_id'), nullable=False)
    
    def __init__(self, tenant_name, mall_id):
        self.tenant_name = tenant_name
        self.mall_id = mall_id
    
@app.route('/get_tenant_data/<string:mall_id>', methods=['GET'])
def get_tenants_by_mall_id(mall_id):
    # Show all tenants in mall with given mall id
    tenants = Tenants.query.filter_by(mall_id=mall_id).all()
    tenant_list = [{'tenant_id': tenant.tenant_id, 'tenant_name': tenant.tenant_name} for tenant in tenants]
    return jsonify({'tenants': tenant_list})

@app.route('/get_tenant_data_by_id/<string:mall_id>/<string:tenant_id>', methods=['GET'])
def get_tenants_by_tenant_name(mall_id, tenant_id):
    # Search for tenant in mall id with a given name
    result = {}
    tenant = Tenants.query.filter_by(mall_id=mall_id, tenant_id=tenant_id).first()
    if not tenant:
        return jsonify({'message': 'Tenant not found'}), 404
    result['tenant_id'] = tenant.tenant_id
    result['tenant_name'] = tenant.tenant_name
    total_weight = db.session.query(ScannedEntries.waste_id, func.sum(ScannedEntries.weight)).filter_by(mall_id=mall_id, tenant_id=tenant_id).group_by(ScannedEntries.waste_id).all()
    #get waste stream names
    waste_streams = Waste.query.all()
    # Construct a dictionary mapping waste id to total weight
    total_weight_dict = {waste_id: weight for waste_id, weight in total_weight}
    #replace waste id with waste stream name
    for waste in waste_streams:
        if waste.waste_id in total_weight_dict:
            total_weight_dict[waste.waste_stream] = total_weight_dict.pop(waste.waste_id)
    
    result['tenant_waste_stream'] = total_weight_dict
    return jsonify(result), 200

    

# Waste
class Waste(db.Model):
    __tablename__ = 'waste'
    waste_id = db.Column(db.String(2), primary_key=True, nullable=False)
    waste_stream = db.Column(db.String(20), nullable=False)
    
    def __init__(self, waste_id, waste_stream):
        self.waste_id = waste_id
        self.waste_stream = waste_stream

@app.route('/get_all_waste_streams', methods=['GET'])
def get_all_waste_streams():
    waste_streams = Waste.query.all()
    # Construct a dictionary mapping waste id to waste streams
    waste_stream_dict = {waste.waste_id: waste.waste_stream for waste in waste_streams}
    return jsonify(waste_stream_dict)

@app.route('/get_waste_stream_by_id/<string:waste_id>', methods=['GET'])
def get_waste_stream_by_id(waste_id):
    # Query the database to get waste stream by id
    waste = Waste.query.filter_by(waste_id=waste_id).first()
    if waste:
        return jsonify({'waste_id': waste.waste_id, 'waste_stream': waste.waste_stream})
    else:
        return jsonify({'error': 'Waste stream not found'}), 404
    

# Scanned Entries
class ScannedEntries(db.Model):
    __tablename__ = 'scanned_entries'
    entry_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    mall_id = db.Column(db.String(3), db.ForeignKey('malls.mall_id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.tenant_id'), nullable=False)
    audit_date = db.Column(db.DateTime, default=datetime.now)
    waste_id = db.Column(db.String(2), nullable=False)
    weight = db.Column(db.Float)
    
    def __init__(self, mall_id, tenant_id, waste_id, weight):
        self.mall_id = mall_id
        self.tenant_id = tenant_id
        self.waste_id = waste_id
        self.weight = weight

@app.route('/get_scanned_entries', methods=['GET'])
def get_scanned_entries():
    scanned_entries = ScannedEntries.query.all()
    scanned_entries_list = [{
        'entry_id': entry.entry_id,
        'mall_id': entry.mall_id,
        'tenant_id': entry.tenant_id,
        'audit_date': entry.audit_date.strftime("%Y-%m-%d %H:%M:%S"),
        'waste_id': entry.waste_id,
        'weight': entry.weight
    } for entry in scanned_entries]

    #add mall name, tenant name, and waste stream to the scanned entries
    for entry in scanned_entries_list:
        mall = Malls.query.filter_by(mall_id=entry['mall_id']).first()
        tenant = Tenants.query.filter_by(tenant_id=entry['tenant_id']).first()
        waste = Waste.query.filter_by(waste_id=entry['waste_id']).first()
        entry['mall_name'] = mall.mall_name
        entry['tenant_name'] = tenant.tenant_name
        entry['waste_stream'] = waste.waste_stream
    return jsonify({'scanned_entries': scanned_entries_list})

@app.route('/add_scanned_entry', methods=['POST'])
def add_scanned_entry():
    data = request.json
    
    mall_id = data['mall_id']
    tenant_id = data['tenant_id']
    waste_id = data['waste_id']
    weight = data['weight']
    
    # Check if data scanned is valid
    mall = Malls.query.filter_by(mall_id=mall_id).first()
    tenant = Tenants.query.filter_by(tenant_id=tenant_id).first()
    if not mall:
        return jsonify({'error': 'Mall does not exist'}), 404
    if not tenant:
        return jsonify({'error': 'Tenant does not exist'}), 404
    
    # Check if waste_id exists in the database
    waste = Waste.query.filter_by(waste_id=waste_id).first()
    if not waste:
        return jsonify({'error': 'Waste not registered'}), 404

    # Create a new ScannedEntries object
    new_entry = ScannedEntries(
        mall_id=mall_id,
        tenant_id=tenant_id,
        waste_id=waste_id,
        weight=weight,
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Scanned entry added successfully'}), 201


# Audits
class Audits(db.Model):
    __tablename__ = 'audits'
    audit_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    audit_status = db.Column(db.String(20), nullable=False)
    mall_id = db.Column(db.String(3), db.ForeignKey('malls.mall_id'), nullable=False)
    
    def __init__(self, audit_status, mall_id):
        self.audit_status = audit_status
        self.mall_id = mall_id

@app.route('/audit_statuses', methods=['GET'])
def get_all_audit_statuses():
    # Get all audit statuses along with mall names
    audit_statuses = Audits.query.join(Malls, Audits.mall_id == Malls.mall_id).add_columns(Audits.audit_id, Audits.audit_status, Malls.mall_name).all()
    
    audit_statuses_list = [{
        'audit_id': audit.audit_id,
        'audit_status': audit.audit_status,
        'mall_name': audit.mall_name
    } for audit in audit_statuses]

    return jsonify({'audit_statuses': audit_statuses_list})

# Generate Barcode
def generate_barcode(mall_id, tenant_id, waste_id):
    return f"{mall_id}-{tenant_id}-{waste_id}"


# Verify Barcode
@app.route('/verify_barcode/<string:scanned_barcode>', methods=['GET'])
def verify_barcode(scanned_barcode):
    print("received request for barcode: " + scanned_barcode)
    [mall_id, tenant_id, waste_id] = scanned_barcode.split('-')
    # remove initial 0s from tenant_id
    tenant_id = int(tenant_id)
    
    # Check if any of the barcode components are missing
    if not all([mall_id, tenant_id, waste_id]):
        return jsonify({'error': 'Missing or invalid barcode components.'}), 400
        # Check if mall_id, tenant_id, and waste_id exist in the database
    mall_result = Malls.query.filter_by(mall_id=mall_id).first()
    if mall_result:
        mall = mall_result.mall_name
    else:
        mall = None  # or whatever default value you want to assign

    tenant_result = Tenants.query.filter_by(tenant_id=tenant_id).first()
    if tenant_result:
        tenant = tenant_result.tenant_name
    else:
        tenant = None  # or whatever default value you want to assign

    waste_result = Waste.query.filter_by(waste_id=waste_id).first()
    if waste_result:
        waste = waste_result.waste_stream
    else:
        waste = None  # or whatever default value you want to assign

    print(mall, tenant, waste)
    if not all([mall, tenant, waste]):
        return jsonify({'error': 'Barcode components do not exist in the database.'}), 404
    
    return jsonify({'data':{'mall_name': mall, 'tenant_name': tenant, 'waste_stream': waste}}), 200
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)