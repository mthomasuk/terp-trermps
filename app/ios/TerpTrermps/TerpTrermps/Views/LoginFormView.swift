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
            
            proceedToView = logUserIn(username: username, password: password)
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
