---
title: "디자인 패턴 활용하기"
date: "2024-03-22"
author: "Jin"
description: "자주 사용되는 디자인 패턴들을 알아봅니다"
category: "Programming"
tags: ["OOP", "디자인패턴", "설계"]
series: "oop-series"
seriesOrder: 3
imageUrl: "/next.svg"
---

# 디자인 패턴 활용하기

디자인 패턴은 소프트웨어 설계에서 자주 발생하는 문제들에 대한 일반적인 해결책입니다.

## 1. 생성 패턴 (Creational Patterns)

### 싱글톤 패턴 (Singleton) 

```java
public class Singleton {
private static Singleton instance;
private Singleton() {}
public static Singleton getInstance() {
if (instance == null) {
instance = new Singleton();
}
return instance;
}
}
```


### 팩토리 메서드 패턴 (Factory Method)

```java
interface Animal {
void makeSound();
}
class Dog implements Animal {
public void makeSound() {
System.out.println("Woof!");
}
}
class Cat implements Animal {
public void makeSound() {
System.out.println("Meow!");
}
}
class AnimalFactory {
public Animal createAnimal(String type) {
if (type.equals("dog")) {
return new Dog();
} else if (type.equals("cat")) {
return new Cat();
}
return null;
}
}
```


## 2. 구조 패턴 (Structural Patterns)

### 어댑터 패턴 (Adapter)

```java
interface MediaPlayer {
void play(String filename);
}
class MP3Player implements MediaPlayer {
public void play(String filename) {
System.out.println("Playing MP3: " + filename);
}
}
class MP4Player {
public void playVideo(String filename) {
System.out.println("Playing MP4: " + filename);
}
}
class MP4Adapter implements MediaPlayer {
private MP4Player mp4Player = new MP4Player();
public void play(String filename) {
mp4Player.playVideo(filename);
}
}
```


## 3. 행위 패턴 (Behavioral Patterns)

### 옵저버 패턴 (Observer)

```java
interface Observer {
void update(String message);
}
class Subject {
private List<Observer> observers = new ArrayList<>();
public void attach(Observer observer) {
observers.add(observer);
}
public void notifyObservers(String message) {
for (Observer observer : observers) {
observer.update(message);
}
}
}
```