//
//  CardView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 15/06/2021.
//

import SwiftUI

func mapToImagePath(name: String) -> String {
    switch name.lowercased() {
        case "kazan-tatar":
            return "kazan_tatar"
        case "tchu-ick":
            return "tchu_ick"
        default:
           return name.lowercased()
    }
}

struct CardView: View {
    var card: CardModel
    var index: Int
    var selectedAttribute: String
    
    var str: Bool {
        return selectedAttribute == "strength"
    }
    
    var skl: Bool {
        return selectedAttribute == "skill"
    }
    
    var mf: Bool {
        return selectedAttribute == "magical_force"
    }
    
    var wpn: Bool {
        return selectedAttribute == "weapons"
    }
    
    var pwr: Bool {
        return selectedAttribute == "power"
    }
    
    var body: some View {
        VStack {
            Image(mapToImagePath(name: card.name))
                .resizable()
                .scaledToFit()
                .frame(width: 190.0, height: 190.0)
            Text(card.type.uppercased()).fontWeight(.bold).font(.system(size: 16))
            Text(card.name.uppercased()).fontWeight(.bold).font(.system(size: 18))
            VStack {
                HStack {
                    Text("Strength").font(.system(size: 14)).foregroundColor(str ? Color.red : Color.black)
                    Spacer()
                    Text("\(card.strength)").font(.system(size: 14)).foregroundColor(str ? Color.red : Color.black)
                }
                HStack {
                    Text("Skill").font(.system(size: 14)).foregroundColor(skl ? Color.red : Color.black)
                    Spacer()
                    Text("\(card.skill)").font(.system(size: 14)).foregroundColor(skl ? Color.red : Color.black)
                }
                HStack {
                    Text("Magical Force").font(.system(size: 14)).foregroundColor(mf ? Color.red : Color.black)
                    Spacer()
                    Text("\(card.magical_force)").font(.system(size: 14)).foregroundColor(mf ? Color.red : Color.black)
                }
                HStack {
                    Text("Weapons").font(.system(size: 14)).foregroundColor(wpn ? Color.red : Color.black)
                    Spacer()
                    Text("\(card.weapons)").font(.system(size: 14)).foregroundColor(wpn ? Color.red : Color.black)
                }
                HStack {
                    Text("Power").font(.system(size: 14)).foregroundColor(pwr ? Color.red : Color.black)
                    Spacer()
                    Text("\(card.power)").font(.system(size: 14)).foregroundColor(pwr ? Color.red : Color.black)
                }
            }
            .padding(.vertical, 5)
            .padding(.horizontal, 10)
        }
        .frame(width: 200.0, height: 352.0)
        .padding(5)
        .background(Color.white)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(red: 222/255, green: 222/255, blue: 222/255), lineWidth: 1)
        )
        .offset(x: CGFloat(index * -4), y: 0)

    }
}
