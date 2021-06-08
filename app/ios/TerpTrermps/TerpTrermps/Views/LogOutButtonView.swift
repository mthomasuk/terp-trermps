//
//  LogOutButtonView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct LogOutButton: View {
    @State var proceedToView: Bool = false
    
    var signOut: () -> Void {
        return {
            UserDefaults.standard.removeObject(forKey: "user")
            proceedToView = true
        }
    }

    var body: some View {
        NavigationLink(destination: LoginView(), isActive: $proceedToView) {}
        Button(
            action: signOut,
            label: {
                Text("Log Out")
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
