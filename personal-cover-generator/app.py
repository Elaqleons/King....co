from flask import Flask, render_template, request

app = Flask(__name__)

DEFAULT_DATA = {
    "full_name": "Amina Hassan",
    "profession": "Software Developer",
    "about_me": "I build practical digital solutions that make work easier and help businesses grow through clean design and effective technology.",
    "skills": "Python • Flask • HTML • CSS • JavaScript • UI Design",
    "phone": "+255 712 345 678",
    "email": "amina.hassan@example.com",
    "location": "Dar es Salaam, Tanzania",
}


@app.route("/", methods=["GET", "POST"])
def home():
    data = DEFAULT_DATA.copy()
    if request.method == "POST":
        form_data = request.form.to_dict()
        for key, value in form_data.items():
            if value and key in data:
                data[key] = value
    return render_template("index.html", data=data)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
