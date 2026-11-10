// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorHabitaMap",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorHabitaMap",
            targets: ["HabitaMapPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "HabitaMapPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/HabitaMapPlugin")
    ]
)
