## Τεχνικές Προδιαγραφές - Αρχιτεκτονικός Σχεδιασμός Συστήματος

- Λειτουγικό Σύστημα: Ubuntu LTS version >= 18.04

- 'Χτίσιμο' εφαρμογής:
  - **npm** >= 7.7.6
  - **nodeJS** >= v15.14.0

- H γλώσσα προγραμματισμού που χρησιμοποιείται σε όλα τα μέρη της εφαρμογής (back end, front end, cli app) είναι η **JavaScript**

- Βάση Δεδομένων: **MongoDB** shell >= v3.6.3

- Επικοινωνία Server με τη Βάση Δεδομένων: MongooseJS >= 5.12.0

- Κλάσεις/Μοντέλα της εφαρμογής:
  - Παρουσιάζονται αναλυτικά από το Class Diagram (στο docs/ClassDiagram.jpg)
  - Ο ορισμός τους γίνεται στο back end μέρος, στον φάκελο [models](https://github.com/spympr/Project-Management-Platform/blob/main/back-end/models)
  - Για μια πιο abstract υλοποίηση, χρησιμοποιούνται κατάλληλοι serializers για οποιαδήποτε λειτουγρία αφορά τα μοντέλα (ορισμός στον φάκελο [serializers](https://github.com/spympr/Project-Management-Platform/blob/main/back-end/serializers))

- **Https** requests μέσω:
  - Express web app framework >= 4.17.1
  - Self Signed Certificates που παράγονται από μας με Open SSL

- Τα requests πραγματοποιούνται βάσει το αρχιτεκτονικό πρότυπο **RESTful APIs**

- Consume του API από τον server: axios >= 0.21.1

- Η **πιστοποίηση χρήστη** που έχει λογαριασμό στην εφαρμογή γίνεται με βάση την λογική των tokens και συγκεκριμένα μέσω των dependencies/middlewares:
  - passport >= 0.4.1
  - passport-jwt >= 4.0.0
  - passport-local >= 1.0.0
  - jsonwebtoken >= 8.5.1

- Επικοινωνία με τις **Υπηρεσίες της Google**:
  - googleapis >= 72.0.0
  - Υπηρεσίες που παρέχονται:
    - Πιστοποίηση και σύνδεση χρήστη μέσω του Google λογαριασμού του
    - Πιστοποίηση και εγγραφή χρήστη μέσω του Google λογαριασμού του

- Αποστολή **email** στους χρήστες της εφαρμογής:
  - Για την επιβεβαίωση του νέου λογαριασμού τους
  - Για την λήψη προσκλήσεων σε projects
  - Μέσω του nodemailer >= 6.5.0

- Συγκέντρωση των κοινών **client requests**, που γίνονται τόσο από το front end όσο και από το cli app, στο library που βρίσκεται στον φάκελο [rest-api-client](https://github.com/spympr/Project-Management-Platform/blob/main/rest-api-client)
  - Στο αρχείο [restAPI](https://github.com/spympr/Project-Management-Platform/blob/main/rest-api-client/restAPI.js) βρίσκεται ο ορισμός του client object που ενημερώνεται συνεχώς από τα responses του server στα client requests που γίνονται (από το front end ή το cli app) και διατηρεί έναν σκελετό από τις πληροφορίες που πρέπει να διατηρούνται για τον χρήστη στο client-side
  - Με στόχο την καλύτερη μελλοντική συντήρηση και επέκταση του project, απομονώσαμε τις συναρτήσεις που υλοποιούν την επικοινωνία με το backend (μέσω του axios) από τις συναρτήσεις που χρησιμοποιεί ο χρήστης, δημιουργώντας ένα επιπλέον επίπεδο. Έτσι το σύστημα είναι πιο abstract.
  - Για το cli app:
    - Για την προσωρινή αποθήκευση των στοιχείων του client σε ένα local αρχείο χρησιμοποιείται το file system module του nodeJS (fs), ώστε να διατηρούνται τα στοιχεία του χρήστη όσο είναι συνδεδεμένος
    - Η διεπαφή του χρήστη με την εφαρμογή πραγματοποιείται μέσω του πακέτου εντολών commander >= 5.1.0

- Για το front-end:
  - Υποστήριξη browser: η εφαρμογή έχει δοκιμαστεί στα Google Chrome & Mozilla Firefox
  - ΓΙα την υλοποίηση των σελίδων χρησιμοποιούνται:
    - Το framework **VueJS** (@vue/cli >= 4.5.12), με κάποια απ' τα βασικότερα dependencies να είναι τα εξής:
      - vuetify >= 2.4.0
      - vuex >= 3.4.0
    - Άλλα dependencies που χρησιμοποιούνται:
      - bootstrap >= 4.6.0
      - quasar >= 1.15.10
      - @fortawesome/vue-fontawesome >= 2.0.2
      - flexsearch v0.7.2 ( FullTextSearch για users κατά τη δημιουργία Project και για την αναζήτηση Tasks )

- Για οδηγίες εγκατάστασης και εκτέλεσης των επιμερούς τμημάτων του Project ανατρέξτε στο κεντρικό [README.md](https://github.com/spympr/Project-Management-Platform/blob/main/README.md).
