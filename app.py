from flask import Flask,render_template,request,redirect,url_for,jsonify
from markupsafe import escape
import pymongo
from werkzeug.security import check_password_hash,generate_password_hash
#===========================================================================================================
# connection_str="mongodb+srv://nguyendakacun:htUezXTkL0llRnwa@dangkhang.nbpxo57.mongodb.net/?retryWrites=true&w=majority&appName=DangKhang"

# Tạo biến để lưu đường dẫn kết nối 
connection_str = "mongodb+srv://mailongkf:22LCNuBgzPZksiMX@cluster0-mailong.4lpjsis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-MaiLong"
try:
    # Tạo kết nối đến MongoDB
    print("Connect done")
    client = pymongo.MongoClient(connection_str)
except Exception:
    # Nếu kết nối bị lỗi
    print("Error" + Exception)

# Truy cập vào cơ sở dữ liệu

mydb = client["khanhdatabase"]
mycol = mydb["todolist"]
mycol_2 = mydb["user_data"]
print("mycol_2: ", mycol_2)

todo_list = []
users_value={}

for x in mycol.find():
	print(x)
	todo_list.append(x)

for x in mycol_2.find():
	print(x["user"])  # trả về dic
	print(x["password"])
	user = x["user"]
	password = x["password"]
    # user_value.append(x)
	# lấy dữ liệu từ x thêm vào user_value
	users_value.update({user:password})

print("user_value: ", users_value)
#===========================================================================================================
app = Flask(__name__)

'''dict chua mat khau va tai khoan nguoi dung'''
#users = {"Khang": generate_password_hash("123456"), "username": generate_password_hash("password")}


'''trang web dau tien'''
@app.route("/")
def first_page():
    return render_template("first_page.html")

@app.route('/register_rq')
def register_rq():
    return redirect(url_for('register'))

@app.route("/register")
def register():
    return render_template("register.html")

@app.route('/login_rq')
def login_rq():
    return redirect(url_for('login'))

@app.route("/login")
def login():
    return render_template("login.html")

'''trang web dung de nhap mat khau va ten nguoi dung'''
@app.route("/handle_get",methods=['GET'])
def handle_get():
    error = None
    if request.method == "GET":
        username = request.form["username"]
        password = request.form["password"]
        print("username: "+ username+" password: "+ password)
        if username in users_value and users_value[username]==password:
                # Successful login, redirect to todolist
                return render_template("todolist.html")
        else:
            # Username not found
            return render_template("login.html", error=error)  # Pass error message
    else:
        # Not a POST request (unexpected)
        return render_template("login.html", error="Unexpected request method")
@app.route("/handle_post",methods=['GET','POST'])
def handle_post():
    error = None
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if username != "" and password !="":
            add_user={"user": username,"password":password}
            # X = col.insert_one(add_user)
            return render_template("todolist.html")
        else:
            # Username not found
            return render_template("register.html")  # Pass error message      
    return render_template("register.html")  # Pass error message  
#=========================================
@app.route('/get_data', methods=['GET'])
def get_data():
    data = list(mycol.find({}, {'_id': 0}))
    return jsonify(data)

@app.route('/add_task', methods=['POST'])
def add_task():
    task_no = request.json['No']
    task_check = request.json['Check']
    task_text = request.json['text']
    task_start_date = request.json['start_date']
    task_end_date = request.json['end_date']
    task_status = request.json['status']
    print(str(task_text))
    new_task = {
            "No": task_no,
            "Check": task_check,
            "text": task_text,
            "start_date": task_start_date,
            "end_date": task_end_date,
            "status": task_status
          }


    result = mycol.insert_one(new_task)
    new_task['_id'] = str(result.inserted_id)

    # Trả về todolist lên lại js
    data = list(mycol.find({}, {'_id': 0}))
    return jsonify(data)

@app.route('/delete_task', methods=['POST'])
def delete_task():
    print("No: " , )
    task_id = request.json['No']
    result = mycol.delete_one({'No': task_id})

    # return jsonify({'_id': task_id})
    # Trả về todolist lên lại js
    data = list(mycol.find({}, {'_id': 0}))
    return jsonify(data)

#=========================================   
if __name__ == "__main__":
    app.run()