*This project has been created as part of the 42 curriculum by raphalme.*

# 42 Inception

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Debian](https://img.shields.io/badge/Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white)
![NGINX](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

---

## 🇬🇧 English Version

### Description
This project aims to broaden your knowledge of system administration by using Docker. You will virtualize several Docker images, creating them in your new personal virtual machine. The goal is to set up a small infrastructure composed of different services following specific rules (security, isolation, separate containers).

### Instructions

#### 1. Prerequisites
- Docker Engine & Docker Compose
- Make
- Administrative privileges (sudo)

#### 2. Network Configuration
Add the domain to your local hosts file:
```bash
# /etc/hosts
127.0.0.1 raphalme.42lausanne.ch
```

#### 3. Execution
The project is built using a Makefile at the root of each directory (`mandatory` and `bonus`).

**Mandatory Part (Core Infrastructure):**
```bash
cd mandatory
make
```

**Bonus Part (Full Features):**
```bash
cd bonus
make
```
Access the services via: `https://raphalme.42lausanne.ch/hub/`

### Project Description

This project consists of setting up a complete web infrastructure using **Docker Compose**.
Main design choices include using **Debian Trixie** (stable/testing) as the base image for all containers to ensure a lightweight and consistent environment. Alpine Linux was avoided as per the subject recommendations (Penultimate stable version of Debian or Alpine).

#### Technical Comparisons

*   **Virtual Machines vs Docker**
    *   **Virtual Machines (VM)**: Virtualize the hardware. Each VM has its own full Operating System (Kernel + User space), making them heavy and slow to boot.
    *   **Docker**: Virtualizes the Operating System. Containers share the host's Linux Kernel but have isolated user spaces. They are lightweight, start instantly, and use fewer resources.

*   **Secrets vs Environment Variables**
    *   **Environment Variables**: Easy to use but less secure. Values are visible in `docker inspect` and can leak in logs.
    *   **Secrets**: Docker Secrets allow managing sensitive data (passwords) securely. They are mounted as files in `/run/secrets/` inside the container and are not exposed in the environment variables. (This project primarily uses `.env` files for educational scope, but secrets are preferred for production).

*   **Docker Network vs Host Network**
    *   **Host Network**: The container shares the host's networking namespace. It uses the host's IP and ports directly (no isolation).
    *   **Docker Network (Bridge)**: Containers are connected to a private virtual network. They are isolated from the host and communicate via internal IPs/DNS. Ports must be explicitly mapped (published) to be accessible from the outside.

*   **Docker Volumes vs Bind Mounts**
    *   **Bind Mounts**: strict mapping of a file/folder from the host to the container. Good for development (live code editing) or specific config files.
    *   **Docker Volumes**: Storage managed entirely by Docker (usually in `/var/lib/docker/volumes`). Better for data persistence, backups, and portability between hosts.

### Resources

*   [Docker Documentation](https://docs.docker.com/)
*   [NGINX Documentation](https://nginx.org/en/docs/)
*   [WordPress Docker Official Image](https://hub.docker.com/_/wordpress)

#### AI Usage
Artificial Intelligence (LLMs) was used in this project to assist with:

*   **Bonus Implementation**: Generating the HTML/CSS code for the "Inception Hub" dashboard to provide a clean interface.
*   **README**: Generating the README file.

---

## 🇫🇷 Version Française

### Description
Ce projet a pour but d'approfondir vos connaissances en administration système en utilisant Docker. Vous allez virtualiser plusieurs images Docker en les créant dans votre nouvelle machine virtuelle personnelle. L'objectif est de mettre en place une petite infrastructure composée de différents services.

### Instructions

#### 1. Prérequis
- Docker Engine & Docker Compose
- Make
- Droits administrateur (sudo)

#### 2. Configuration Réseau
Ajoutez le domaine à votre fichier hosts local :
```bash
# /etc/hosts
127.0.0.1 raphalme.42lausanne.ch
```

#### 3. Exécution
**Partie Bonus (Recommandée) :**
```bash
cd bonus
make
```
Accès aux services via : `https://raphalme.42lausanne.ch/hub/`

### Description du Projet

#### Comparaisons Techniques

*   **Machines Virtuelles vs Docker**
    *   **VM** : Virtualisent le matériel. Chaque VM a son propre OS complet, ce qui est lourd.
    *   **Docker** : Virtualise l'OS. Les conteneurs partagent le noyau de l'hôte, ce qui est très léger et rapide.

*   **Secrets vs Variables d'Environnement**
    *   **Variables d'Environnement** : Simples mais visibles (via `docker inspect`).
    *   **Secrets** : Système sécurisé de Docker pour gérer les mots de passe (montés comme fichiers).

*   **Réseau Docker vs Réseau Hôte**
    *   **Réseau Hôte** : Pas d'isolation, le conteneur utilise l'IP de la machine.
    *   **Réseau Docker** : Isolation complète, réseau privé virtuel entre les conteneurs.

*   **Volumes Docker vs Bind Mounts**
    *   **Bind Mounts** : Lien direct vers un dossier précis de l'hôte.
    *   **Volumes** : Espace de stockage géré et optimisé par Docker (indépendant de l'arborescence utilisateur).

### Ressources & Usage de l'IA
L'IA a été utilisée pour :
*   La création du design (HTML/CSS) du Dashboard "Hub".
*   Le README.

