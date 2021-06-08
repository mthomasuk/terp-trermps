//
//  HomeView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct HomeView: View {
    let user: UserModel = retriveLoggedInUser()!

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    VStack(alignment: .center) {
                        Logo()
                    }
                    VStack(alignment: .center) {
                        Text("Welcome \(user.name)")
                    }
                    Spacer()
                    VStack(alignment: .center) {
                        Text("I do not own any of the images or text on this site - it all belongs to Waddingtons or whatever mega-corporation bought them out years ago.")
                            .font(.system(size: 10))
                            .padding(.vertical, 2)
                            .multilineTextAlignment(.center)
                        Text("Code is my own, with the obvious exception of stuff I have liberally stolen from previous colleagues, stackoverflow etc. etc.")
                            .font(.system(size: 10))
                            .padding(.vertical, 2)
                            .multilineTextAlignment(.center)
                        Text("HaCk ThE pLaNeT")
                            .font(.system(size: 10))
                            .padding(.vertical, 2)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.vertical, 15)
                    .padding(.horizontal, 30)

                    LogOutButton()
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarHidden(true) 
    }
}
