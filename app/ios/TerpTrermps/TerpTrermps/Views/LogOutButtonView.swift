//
//  LogOutButtonView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct LogOutButton: View {
    @EnvironmentObject var navController: NavigationController
    
    @State var proceedToView: Bool = false
    
    var signOut: () -> Void {
        return {
            logUserOut()

            DispatchQueue.main.async {
                self.navController.route = "login"
            }
        }
    }

    var body: some View {
        NavigationLink(destination: LoginView(), isActive: $proceedToView) { EmptyView() }
        Button(
            action: signOut,
            label: {
                Text("Log Out")
                    .font(.footnote)
                    .padding(.vertical, 5)
                    .padding(.horizontal, 10)
                    .foregroundColor(Color.black)
                    .cornerRadius(15)
                    .background(
                        Color(red: 355/255, green: 215/255, blue: 0/255)
                            .shadow(color: Color.black, radius: 0, x: 3.0, y: 3.0)
                    )

            }
        ).padding(.vertical, 10)
    }
}
