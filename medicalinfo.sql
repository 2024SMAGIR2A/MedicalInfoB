-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 16 jan. 2025 à 18:03
-- Version du serveur : 8.0.27
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `medicalinfo`
--

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `Authentication`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `Authentication` (IN `Login` VARCHAR(500), IN `MotPasse` VARCHAR(500))  SELECT u.idUtilisateur,u.Nom,u.Prenom,u.idRole
FROM utilisateur u
WHERE u.email=Login
and u.motDePasse=MD5(MotPasse)$$

DROP PROCEDURE IF EXISTS `GetAllergieByPatientId`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllergieByPatientId` (IN `Id` INT)  SELECT al.idAllergie,al.idUtilisateur,al.nom,al.isDeleted
FROM allergies al
where al.idUtilisateur=Id$$

DROP PROCEDURE IF EXISTS `GetPatientList`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPatientList` ()  SELECT u.idUtilisateur,LPAD(u.idUtilisateur, 5, 0) IdUtilisateurPad,concat(u.nom, ' ' ,u.prenom) NomPrenom,g.nom GroupeSanguin,u.telephone,u.email,co.observations
,concat(med.nom, ' ' ,med.prenom) NomPrenomMedecin
FROM utilisateur u
LEFT JOIN groupesanguin g on g.idGroupeSanguin=u.idGroupeSanguin
LEFT JOIN
(
     SELECT MIN(co.idConsultation) MinIdConsultation,dm.idPatient
     FROM dossiermedical dm
     JOIN consultation co on co.idDossier=dm.idDossier
     GROUP BY dm.idPatient
)coo on coo.idPatient= u.idUtilisateur
LEFT JOIN consultation co on co.idConsultation=coo.MinIdConsultation
LEFT JOIN dossiermedical dos on dos.idDossier=co.idDossier
LEFT JOIN utilisateur med on med.idUtilisateur=dos.idMedecin$$

DROP PROCEDURE IF EXISTS `GetTraitementByPatientId`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTraitementByPatientId` (IN `PatientId` INT)  SELECT LPAD(dm.idDossier, 5, 0) idDossier,dm.idStatutDossierMedical,st.nom StatutDossier,st.nom,dm.idPatient,dm.idMedecin,concat('Dr',' .',med.nom) Medecin,co.idConsultation,co.observations, t.idTraitement,concat(t.nom,' (',t.description,')') nom,t.description,t.dosage,co.dateConsultation,
co.recommandations
FROM dossiermedical dm
JOIN statutdossiermedical st on st.idStatutDossierMedical=dm.idStatutDossierMedical
JOIN consultation co on co.idDossier=dm.idDossier
JOIN traitement t on t.idConsultation=co.idConsultation
JOIN utilisateur pa on pa.idUtilisateur=dm.idPatient
JOIN utilisateur med on med.idUtilisateur=dm.idMedecin

WHERE dm.idPatient=PatientId$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `allergies`
--

DROP TABLE IF EXISTS `allergies`;
CREATE TABLE IF NOT EXISTS `allergies` (
  `idAllergie` int NOT NULL AUTO_INCREMENT,
  `idUtilisateur` int DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idAllergie`),
  KEY `idUtilisateur` (`idUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `allergies`
--

INSERT INTO `allergies` (`idAllergie`, `idUtilisateur`, `nom`, `isDeleted`) VALUES
(1, 3, 'Pénicilline', 0),
(2, 3, 'Arachides', 0),
(3, 4, 'Lactose', 0),
(4, 4, 'Pollen', 0),
(5, 3, 'Aspirine', 0),
(6, 5, 'Allergie aux pollens', 0),
(7, 5, 'Allergie aux antibiotiques', 0);

-- --------------------------------------------------------

--
-- Structure de la table `consultation`
--

DROP TABLE IF EXISTS `consultation`;
CREATE TABLE IF NOT EXISTS `consultation` (
  `idConsultation` int NOT NULL AUTO_INCREMENT,
  `idDossier` int DEFAULT NULL,
  `dateConsultation` date NOT NULL,
  `observations` text,
  `recommandations` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idConsultation`),
  KEY `idDossier` (`idDossier`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `consultation`
--

INSERT INTO `consultation` (`idConsultation`, `idDossier`, `dateConsultation`, `observations`, `recommandations`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 1, '2025-01-01', 'Mal de tête léger', 'Continuer le traitement', '2025-01-14 12:14:36', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 2, '2025-01-05', 'Légère fièvre', 'Repos et hydratation', '2025-01-14 12:11:21', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, '2025-01-11', 'Douleurs articulaires', 'Kinésithérapie recommandée', '2025-01-14 12:11:26', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, '2025-01-16', 'Tension élevée', 'Régime sans sel', '2025-01-14 12:11:31', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 5, '2025-01-21', 'Toux persistante', 'Antibiotiques prescrits', '2025-01-14 12:11:37', '0000-00-00 00:00:00', 1, NULL, 0),
(6, 6, '2025-01-15', 'Observation de routine pour le patient.', 'Recommandation : repos et suivi.', '2025-01-15 10:48:07', '2025-01-15 10:48:07', 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `creneauxdisponibles`
--

DROP TABLE IF EXISTS `creneauxdisponibles`;
CREATE TABLE IF NOT EXISTS `creneauxdisponibles` (
  `idCreneau` int NOT NULL AUTO_INCREMENT,
  `idUtilisateur` int DEFAULT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idCreneau`),
  KEY `idUtilisateur` (`idUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COMMENT='Les créneaux d''un même utilisateur ne doivent pas se chevaucher.';

--
-- Déchargement des données de la table `creneauxdisponibles`
--

INSERT INTO `creneauxdisponibles` (`idCreneau`, `idUtilisateur`, `dateDebut`, `dateFin`, `isDeleted`) VALUES
(1, 1, '2025-01-13 09:00:00', '2025-01-13 10:00:00', 0),
(2, 1, '2025-01-13 10:00:00', '2025-01-13 11:00:00', 0),
(3, 2, '2025-01-13 14:00:00', '2025-01-13 15:00:00', 0),
(4, 2, '2025-01-13 15:00:00', '2025-01-13 16:00:00', 0),
(5, 1, '2025-01-13 16:00:00', '2025-01-13 17:00:00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `dossiermedical`
--

DROP TABLE IF EXISTS `dossiermedical`;
CREATE TABLE IF NOT EXISTS `dossiermedical` (
  `idDossier` int NOT NULL AUTO_INCREMENT,
  `idPatient` int DEFAULT NULL,
  `idMedecin` int DEFAULT NULL,
  `idStatutDossierMedical` int DEFAULT NULL,
  `dateCreation` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idDossier`),
  KEY `idPatient` (`idPatient`),
  KEY `idMedecin` (`idMedecin`),
  KEY `idStatutDossierMedical` (`idStatutDossierMedical`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `dossiermedical`
--

INSERT INTO `dossiermedical` (`idDossier`, `idPatient`, `idMedecin`, `idStatutDossierMedical`, `dateCreation`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 3, 1, 1, '2025-01-12', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 4, 2, 1, '2025-01-12', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, 2, 2, '2025-01-12', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, 1, 1, '2025-01-12', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 3, 1, 3, '2025-01-12', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(6, 5, 2, 1, '2025-01-15', '2025-01-15 10:48:07', '2025-01-15 10:48:07', 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `examen`
--

DROP TABLE IF EXISTS `examen`;
CREATE TABLE IF NOT EXISTS `examen` (
  `idExamen` int NOT NULL AUTO_INCREMENT,
  `idDossier` int DEFAULT NULL,
  `idTypeExamen` int DEFAULT NULL,
  `dateExamen` date NOT NULL,
  `resultats` text,
  `rapport` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idExamen`),
  KEY `idDossier` (`idDossier`),
  KEY `idTypeExamen` (`idTypeExamen`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `examen`
--

INSERT INTO `examen` (`idExamen`, `idDossier`, `idTypeExamen`, `dateExamen`, `resultats`, `rapport`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 1, 1, '2025-01-12', 'Résultats normaux', 'RAS', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 2, 2, '2025-01-12', 'Présence anomalie', 'Nécessite suivi', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, 3, '2025-01-12', 'Examens complémentaires requis', 'À surveiller', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, 4, '2025-01-12', 'Résultats dans la normale', 'Contrôle dans 6 mois', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 5, 5, '2025-01-12', 'Légère inflammation', 'Traitement prescrit', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

DROP TABLE IF EXISTS `facture`;
CREATE TABLE IF NOT EXISTS `facture` (
  `idFacture` int NOT NULL AUTO_INCREMENT,
  `idConsultation` int DEFAULT NULL,
  `dateFacturation` date NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `idStatutFacture` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idFacture`),
  KEY `idConsultation` (`idConsultation`),
  KEY `idStatutFacture` (`idStatutFacture`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `facture`
--

INSERT INTO `facture` (`idFacture`, `idConsultation`, `dateFacturation`, `montant`, `idStatutFacture`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 1, '2025-01-12', '25.00', 1, '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 2, '2025-01-12', '35.00', 2, '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, '2025-01-12', '45.00', 1, '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, '2025-01-12', '25.00', 3, '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 5, '2025-01-12', '35.00', 4, '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `groupesanguin`
--

DROP TABLE IF EXISTS `groupesanguin`;
CREATE TABLE IF NOT EXISTS `groupesanguin` (
  `idGroupeSanguin` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(5) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idGroupeSanguin`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `groupesanguin`
--

INSERT INTO `groupesanguin` (`idGroupeSanguin`, `nom`, `description`, `isDeleted`) VALUES
(1, 'A+', 'Groupe sanguin A positif', 0),
(2, 'B+', 'Groupe sanguin B positif', 0),
(3, 'O+', 'Groupe sanguin O positif', 0),
(4, 'AB+', 'Groupe sanguin AB positif', 0),
(5, 'O-', 'Groupe sanguin O négatif', 0);

-- --------------------------------------------------------

--
-- Structure de la table `rapportmedical`
--

DROP TABLE IF EXISTS `rapportmedical`;
CREATE TABLE IF NOT EXISTS `rapportmedical` (
  `idRapport` int NOT NULL AUTO_INCREMENT,
  `idDossier` int DEFAULT NULL,
  `dateProd` date NOT NULL,
  `contenu` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idRapport`),
  KEY `idDossier` (`idDossier`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `rapportmedical`
--

INSERT INTO `rapportmedical` (`idRapport`, `idDossier`, `dateProd`, `contenu`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 1, '2025-01-12', 'Rapport de consultation standard', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 2, '2025-01-12', 'Rapport d\'urgence', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, '2025-01-12', 'Rapport de suivi trimestriel', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, '2025-01-12', 'Rapport de contrôle annuel', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 5, '2025-01-12', 'Rapport d\'hospitalisation', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `rendezvous`
--

DROP TABLE IF EXISTS `rendezvous`;
CREATE TABLE IF NOT EXISTS `rendezvous` (
  `idRendezVous` int NOT NULL AUTO_INCREMENT,
  `idPatient` int DEFAULT NULL,
  `idMedecin` int DEFAULT NULL,
  `idTypeRendezVous` int DEFAULT NULL,
  `idStatutRendezVous` int DEFAULT NULL,
  `dateHeure` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idRendezVous`),
  KEY `idPatient` (`idPatient`),
  KEY `idMedecin` (`idMedecin`),
  KEY `idTypeRendezVous` (`idTypeRendezVous`),
  KEY `idStatutRendezVous` (`idStatutRendezVous`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `rendezvous`
--

INSERT INTO `rendezvous` (`idRendezVous`, `idPatient`, `idMedecin`, `idTypeRendezVous`, `idStatutRendezVous`, `dateHeure`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 3, 1, 1, 1, '2025-01-13 09:00:00', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 4, 2, 2, 2, '2025-01-13 10:00:00', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, 2, 3, 1, '2025-01-13 11:00:00', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, 1, 4, 3, '2025-01-13 14:00:00', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 3, 1, 5, 4, '2025-01-13 15:00:00', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `idRole` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idRole`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`idRole`, `nom`, `description`, `isDeleted`) VALUES
(1, 'Médecin', 'Docteur en médecine', 0),
(2, 'Patient', 'Patient de la clinique', 0),
(3, 'Infirmier', 'Personnel infirmier', 0),
(4, 'Administrateur', 'Gestionnaire système', 0),
(5, 'Secrétaire', 'Personnel administratif', 0);

-- --------------------------------------------------------

--
-- Structure de la table `specialite`
--

DROP TABLE IF EXISTS `specialite`;
CREATE TABLE IF NOT EXISTS `specialite` (
  `idSpecialite` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idSpecialite`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `specialite`
--

INSERT INTO `specialite` (`idSpecialite`, `nom`, `code`, `description`, `isDeleted`) VALUES
(1, 'Cardiologie', 'CARD', 'Spécialiste du cœur', 0),
(2, 'Pédiatrie', 'PED', 'Médecine des enfants', 0),
(3, 'Dermatologie', 'DERM', 'Spécialiste de la peau', 0),
(4, 'Neurologie', 'NEURO', 'Spécialiste du système nerveux', 0),
(5, 'Ophtalmologie', 'OPHT', 'Spécialiste des yeux', 0);

-- --------------------------------------------------------

--
-- Structure de la table `statutdossiermedical`
--

DROP TABLE IF EXISTS `statutdossiermedical`;
CREATE TABLE IF NOT EXISTS `statutdossiermedical` (
  `idStatutDossierMedical` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idStatutDossierMedical`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `statutdossiermedical`
--

INSERT INTO `statutdossiermedical` (`idStatutDossierMedical`, `nom`, `description`, `isDeleted`) VALUES
(1, 'Actif', 'Dossier en cours', 0),
(2, 'Archivé', 'Dossier archivé', 0),
(3, 'En attente', 'Dossier en attente de validation', 0),
(4, 'Transféré', 'Dossier transféré', 0),
(5, 'Fermé', 'Dossier clôturé', 0);

-- --------------------------------------------------------

--
-- Structure de la table `statutfacture`
--

DROP TABLE IF EXISTS `statutfacture`;
CREATE TABLE IF NOT EXISTS `statutfacture` (
  `idStatutFacture` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idStatutFacture`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `statutfacture`
--

INSERT INTO `statutfacture` (`idStatutFacture`, `nom`, `description`, `isDeleted`) VALUES
(1, 'En attente', 'Facture non payée', 0),
(2, 'Payée', 'Facture réglée', 0),
(3, 'Annulée', 'Facture annulée', 0),
(4, 'Remboursée', 'Facture remboursée', 0),
(5, 'Échue', 'Facture en retard de paiement', 0);

-- --------------------------------------------------------

--
-- Structure de la table `statutrendezvous`
--

DROP TABLE IF EXISTS `statutrendezvous`;
CREATE TABLE IF NOT EXISTS `statutrendezvous` (
  `idStatutRendezVous` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idStatutRendezVous`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `statutrendezvous`
--

INSERT INTO `statutrendezvous` (`idStatutRendezVous`, `nom`, `description`, `isDeleted`) VALUES
(1, 'Planifié', 'Rendez-vous programmé', 0),
(2, 'Confirmé', 'Rendez-vous confirmé', 0),
(3, 'Annulé', 'Rendez-vous annulé', 0),
(4, 'Terminé', 'Rendez-vous effectué', 0),
(5, 'Reporté', 'Rendez-vous reporté', 0);

-- --------------------------------------------------------

--
-- Structure de la table `traitement`
--

DROP TABLE IF EXISTS `traitement`;
CREATE TABLE IF NOT EXISTS `traitement` (
  `idTraitement` int NOT NULL AUTO_INCREMENT,
  `idConsultation` int DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `dosage` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idTraitement`),
  KEY `idConsultation` (`idConsultation`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `traitement`
--

INSERT INTO `traitement` (`idTraitement`, `idConsultation`, `nom`, `description`, `dosage`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, 1, 'Doliprane', 'Antalgique', '1000mg 3x/jour', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(2, 2, 'Amoxicilline', 'Antibiotique', '500mg 2x/jour', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(3, 3, 'Ibuprofène', 'Anti-inflammatoire', '400mg 3x/jour', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 2, NULL, 0),
(4, 4, 'Ventoline', 'Bronchodilatateur', '100µg 2x/jour', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(5, 5, 'Kardégic', 'Antiagrégant', '75mg 1x/jour', '2025-01-12 17:51:39', '0000-00-00 00:00:00', 1, NULL, 0),
(6, 6, 'Antihistaminique', 'Traitement contre l’allergie.', '1 comprimé par jour', '2025-01-15 10:48:08', '2025-01-15 10:48:08', 1, 1, 0),
(7, 6, 'Anti-inflammatoire', 'Réduit les réactions allergiques.', '2 comprimés par jour', '2025-01-15 10:48:08', '2025-01-15 10:48:08', 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `typeexamen`
--

DROP TABLE IF EXISTS `typeexamen`;
CREATE TABLE IF NOT EXISTS `typeexamen` (
  `idTypeExamen` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idTypeExamen`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `typeexamen`
--

INSERT INTO `typeexamen` (`idTypeExamen`, `nom`, `description`, `isDeleted`) VALUES
(1, 'Prise de sang', 'Analyse sanguine complète', 0),
(2, 'Radio', 'Radiographie standard', 0),
(3, 'Scanner', 'Tomodensitométrie', 0),
(4, 'IRM', 'Imagerie par résonance magnétique', 0),
(5, 'Échographie', 'Examen par ultrasons', 0);

-- --------------------------------------------------------

--
-- Structure de la table `typerendezvous`
--

DROP TABLE IF EXISTS `typerendezvous`;
CREATE TABLE IF NOT EXISTS `typerendezvous` (
  `idTypeRendezVous` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` text,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idTypeRendezVous`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `typerendezvous`
--

INSERT INTO `typerendezvous` (`idTypeRendezVous`, `nom`, `description`, `isDeleted`) VALUES
(1, 'Consultation', 'Consultation standard', 0),
(2, 'Urgence', 'Consultation urgente', 0),
(3, 'Suivi', 'Rendez-vous de suivi', 0),
(4, 'Vaccination', 'Séance de vaccination', 0),
(5, 'Contrôle', 'Visite de contrôle', 0);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `idUtilisateur` int NOT NULL AUTO_INCREMENT,
  `idRole` int DEFAULT NULL,
  `idGroupeSanguin` int DEFAULT NULL,
  `idSpecialite` int DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `email` (`email`),
  KEY `idRole` (`idRole`),
  KEY `idGroupeSanguin` (`idGroupeSanguin`),
  KEY `idSpecialite` (`idSpecialite`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COMMENT='idSpecialite est obligatoire si l''utilisateur a un rôle de médecin.';

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`idUtilisateur`, `idRole`, `idGroupeSanguin`, `idSpecialite`, `nom`, `prenom`, `email`, `telephone`, `motDePasse`, `createdAt`, `updatedAt`, `isDeleted`) VALUES
(1, 1, 1, 1, 'Dupont', 'Jean', 'jean.dupont@email.com', '0123456789', '5f4dcc3b5aa765d61d8327deb882cf99', '2025-01-14 20:52:30', '0000-00-00 00:00:00', 0),
(2, 1, 2, 2, 'Martin', 'Sophie', 'sophie.martin@email.com', '0234567891', '5f4dcc3b5aa765d61d8327deb882cf99', '2025-01-14 20:52:30', '0000-00-00 00:00:00', 0),
(3, 2, 3, NULL, 'Dubois', 'Pierre', 'pierre.dubois@email.com', '0345678912', '5f4dcc3b5aa765d61d8327deb882cf99', '2025-01-14 20:52:30', '0000-00-00 00:00:00', 0),
(4, 2, 4, NULL, 'Leroy', 'Marie', 'marie.leroy@email.com', '0456789123', '5f4dcc3b5aa765d61d8327deb882cf99', '2025-01-14 20:52:30', '0000-00-00 00:00:00', 0),
(5, 3, 5, NULL, 'Moreau', 'Lucas', 'lucas.moreau@email.com', '0567891234', '5f4dcc3b5aa765d61d8327deb882cf99', '2025-01-14 20:52:30', '0000-00-00 00:00:00', 0);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `allergies`
--
ALTER TABLE `allergies`
  ADD CONSTRAINT `Allergies_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `consultation`
--
ALTER TABLE `consultation`
  ADD CONSTRAINT `Consultation_ibfk_1` FOREIGN KEY (`idDossier`) REFERENCES `dossiermedical` (`idDossier`),
  ADD CONSTRAINT `Consultation_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `Consultation_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `creneauxdisponibles`
--
ALTER TABLE `creneauxdisponibles`
  ADD CONSTRAINT `CreneauxDisponibles_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `dossiermedical`
--
ALTER TABLE `dossiermedical`
  ADD CONSTRAINT `DossierMedical_ibfk_1` FOREIGN KEY (`idPatient`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `DossierMedical_ibfk_2` FOREIGN KEY (`idMedecin`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `DossierMedical_ibfk_3` FOREIGN KEY (`idStatutDossierMedical`) REFERENCES `statutdossiermedical` (`idStatutDossierMedical`),
  ADD CONSTRAINT `DossierMedical_ibfk_4` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `DossierMedical_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `examen`
--
ALTER TABLE `examen`
  ADD CONSTRAINT `Examen_ibfk_1` FOREIGN KEY (`idDossier`) REFERENCES `dossiermedical` (`idDossier`),
  ADD CONSTRAINT `Examen_ibfk_2` FOREIGN KEY (`idTypeExamen`) REFERENCES `typeexamen` (`idTypeExamen`),
  ADD CONSTRAINT `Examen_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `Examen_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `Facture_ibfk_1` FOREIGN KEY (`idConsultation`) REFERENCES `consultation` (`idConsultation`),
  ADD CONSTRAINT `Facture_ibfk_2` FOREIGN KEY (`idStatutFacture`) REFERENCES `statutfacture` (`idStatutFacture`),
  ADD CONSTRAINT `Facture_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `Facture_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `rapportmedical`
--
ALTER TABLE `rapportmedical`
  ADD CONSTRAINT `RapportMedical_ibfk_1` FOREIGN KEY (`idDossier`) REFERENCES `dossiermedical` (`idDossier`),
  ADD CONSTRAINT `RapportMedical_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `RapportMedical_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `rendezvous`
--
ALTER TABLE `rendezvous`
  ADD CONSTRAINT `RendezVous_ibfk_1` FOREIGN KEY (`idPatient`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `RendezVous_ibfk_2` FOREIGN KEY (`idMedecin`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `RendezVous_ibfk_3` FOREIGN KEY (`idTypeRendezVous`) REFERENCES `typerendezvous` (`idTypeRendezVous`),
  ADD CONSTRAINT `RendezVous_ibfk_4` FOREIGN KEY (`idStatutRendezVous`) REFERENCES `statutrendezvous` (`idStatutRendezVous`),
  ADD CONSTRAINT `RendezVous_ibfk_5` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `RendezVous_ibfk_6` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `traitement`
--
ALTER TABLE `traitement`
  ADD CONSTRAINT `Traitement_ibfk_1` FOREIGN KEY (`idConsultation`) REFERENCES `consultation` (`idConsultation`),
  ADD CONSTRAINT `Traitement_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `utilisateur` (`idUtilisateur`),
  ADD CONSTRAINT `Traitement_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `utilisateur` (`idUtilisateur`);

--
-- Contraintes pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD CONSTRAINT `Utilisateur_ibfk_1` FOREIGN KEY (`idRole`) REFERENCES `role` (`idRole`),
  ADD CONSTRAINT `Utilisateur_ibfk_2` FOREIGN KEY (`idGroupeSanguin`) REFERENCES `groupesanguin` (`idGroupeSanguin`),
  ADD CONSTRAINT `Utilisateur_ibfk_3` FOREIGN KEY (`idSpecialite`) REFERENCES `specialite` (`idSpecialite`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
