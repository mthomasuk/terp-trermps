//
//  LoginView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct LoginForm: View {
    @State private var username: String = ""
    @State private var password: String = ""
    
    @State var proceedToView: Bool = false
    
    var signIn: () -> Void {
        return {
            guard !username.isEmpty || !password.isEmpty else {
                return
            }
            
            UserDefaults.standard.removeObject(forKey: "user")
            
            let url = URL(string: "http://localhost:4001/api/login")!
            var request = URLRequest(url: url)
            
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            let body = ["name": username, "password": password]
            let json = try? JSONSerialization.data(withJSONObject: body, options: [])
            
            request.httpMethod = "POST"
            request.httpBody = json;
            
            let session = URLSession.shared
            let task = session.dataTask(with: request) { (data, response, error) in
                if error != nil {
                    print(error as Any)
                } else if let data = data {
                    if let JSONString = String(data: data, encoding: String.Encoding.utf8) {
                        print(JSONString)
                        UserDefaults.standard.set(JSONString, forKey: "user")
                        proceedToView = true
                    }
                } else {
                    print("Something has gone horrifically wrong")
                }
            }
                
            task.resume()
        }
    }

    var body: some View {
        NavigationLink(destination: HomeView(), isActive: $proceedToView) {}
        VStack {
            VStack(alignment: .leading) {
                Text("PLZ ENTER YOUR NAME:").font(.footnote)
                TextField("Your name, plz", text: $username)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.alphabet)
            }
            VStack(alignment: .leading) {
                Text("PLZ ENTER A PASSWORD:").font(.footnote)
                SecureField("Your password, plz", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disableAutocorrection(true)
                    .keyboardType(.alphabet)
            }
            Button(
                action: signIn,
                label: {
                    Text("Login")
                        .font(.footnote)
                        .padding(.vertical, 5)
                        .padding(.horizontal, 10)
                        .foregroundColor(Color.black)
                        .background(
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(Color.black, lineWidth: 0.5)
                                .background(Color(red: 233/255, green: 237/255, blue: 233/255))
                    )
                }
            ).padding(.vertical, 10)
        }
    }
}
