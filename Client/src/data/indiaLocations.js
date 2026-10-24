/**
 * Comprehensive Indian Administrative Location Master Data
 * State -> District -> Block (Tehsil / Taluka)
 * Tailored for Agricultural Machinery & Rural Tractor Rentals
 */

export const locationHierarchy = {
  "Uttar Pradesh": {
    "Varanasi": ["Arajiline", "Baragaon", "Cholapur", "Harahua", "Kashi Vidyapeeth", "Pindra", "Sevapuri"],
    "Gorakhpur": ["Bansgaon", "Barhalganj", "Belghat", "Bhathat", "Brahmpur", "Campierganj", "Chargawan", "Gagaha", "Gola", "Jungle Kaudia", "Khorabar", "Pipraich", "Piprauli", "Sahjanwa", "Sardarnagar", "Uruwa"],
    "Prayagraj": ["Bahadurpur", "Chaka", "Dhanupur", "Handia", "Holagarh", "Jasra", "Karchhana", "Kaurihar", "Koraon", "Manda", "Mauaima", "Meja", "Pratappur", "Phulpur", "Saidabad", "Shankargarh", "Soraon", "Sringverpur Dham", "Uruwa"],
    "Mirzapur": ["Chhanvey", "City", "Hallia", "Jamalpur", "Kon", "Lalganj", "Majhawa", "Marihan", "Narayanpur", "Pahari", "Rajgarh", "Sikhar"],
    "Sonbhadra": ["Babhani", "Chatra", "Chopin", "Duddhi", "Ghorawal", "Myorpur", "Nagwa", "Robertsganj"],
    "Chandauli": ["Barahani", "Chakiya", "Chandauli", "Dhanapur", "Naugarh", "Niyamtabad", "Sakaldiha", "Shahabganj"],
    "Jaunpur": ["Badlapur", "Baksha", "Barsathi", "Dharmapur", "Dobhi", "Jalalpur", "Karakat", "Kerakat", "Khutahan", "Machhlishahr", "Maharajganj", "Mariahu", "Muftiganj", "Rampur", "Shahganj", "Sikrara", "Sirkoni", "Sujanaganj"],
    "Ghazipur": ["Barachawar", "Bhaurkaha", "Deokali", "Ghazipur", "Jakhanian", "Karanda", "Kasimabad", "Manihari", "Mardah", "Mohammadabad", "Reotipur", "Sadat", "Saidpur", "Zamania"],
    "Azamgarh": ["Ahiraula", "Atraulia", "Bilariyaganj", "Haraiya", "Jahanaganj", "Koilsa", "Lalganj", "Martinganj", "Mehnagar", "Mirzapur", "Mohammadpur", "Palhana", "Phoolpur", "Pawai", "Rani Ki Sarai", "Sathiaon", "Tahbarpur", "Tarwa", "Thekma"],
    "Ballia": ["Bairia", "Bansdih", "Belhari", "Beruarbari", "Chilkahar", "Dubhar", "Garwar", "Hanumanganj", "Maniyar", "Muralichhapra", "Nagra", "Nawanagar", "Pandah", "Rasra", "Ratsar Kalan", "Reoti", "Siar", "Sohav"],
    "Bhadohi": ["Abholi", "Aurai", "Bhadohi", "Deegh", "Gyanpur", "Suriyawan"],
    "Mau": ["Badhuapur", "Doharighat", "Fatehpur Madaun", "Ghosi", "Kopaganj", "Mohammadabad Gohna", "Pardaha", "Ranipur", "Ratanpura"],
    "Ayodhya": ["Amaniganj", "Bikapur", "Harringtonganj", "Masaudha", "Maya Bazar", "Milkipur", "Pura Bazar", "Rudauli", "Sohawal", "Tarun"],
    "Lucknow": ["Bakshi Ka Talab", "Chinhat", "Gosainganj", "Kakori", "Mal", "Malihabad", "Mohanlalganj", "Sarojininagar"],
    "Kanpur Nagar": ["Bhitargaon", "Bidhnu", "Chaubepur", "Ghatampur", "Kalyanpur", "Patara", "Sarsaul", "Shivrajpur"],
    "Kanpur Dehat": ["Akbarpur", "Amrutpur", "Derapur", "Jhinjhak", "Malasa", "Maitha", "Rajpur", "Rasulabad", "Rura", "Sandallpur", "Sarbankhera"],
    "Agra": ["Achhnera", "Akola", "Bah", "Barauli Ahir", "Bichpuri", "Etmadpur", "Fatehabad", "Fatehpur Sikri", "Jagner", "Jaitpur Kalan", "Khandauli", "Kheragarh", "Pinahat", "Saiyan", "Shamshabad"],
    "Aligarh": ["Akrabad", "Atrauli", "Bijhauli", "Chandaus", "Dhanipur", "Gonda", "Iglas", "Jawan Sikanderpur", "Khair", "Lodha", "Tappal"],
    "Ambedkar Nagar": ["Akbarpur", "Baskhari", "Bhiwadi", "Jalalpur", "Katehari", "Ramnagar", "Tanda"],
    "Amethi": ["Amethi", "Bhadar", "B भेटua", "Gauriganj", "Jagdishpur", "Jamo", "Musafirkhana", "Sangrampur", "Shahgarh", "Shukla Bazar", "Tiloi"],
    "Amroha": ["Amroha", "Dhanaura", "Gajraula", "Hasanpur", "Joya", "Naugawan Sadat"],
    "Auraiya": ["Achhalda", "Ajitmal", "Auraiya", "Bhagyanagar", "Bidhuna", "Erwa Katra", "Sahar"],
    "Baghpat": ["Baghpat", "Baraut", "Binauli", "Chhaprauli", "Khekra", "Pilana"],
    "Bahraich": ["Chittaura", "Fakharpur", "Huzoorpur", "Jarwal", "Kaisarganj", "Mahasi", "Mihipurwa", "Nawabganj", "Payagpur", "Phakharpur", "Risia", "Shivpur", "Tejwapur", "Visheshwarganj"],
    "Balrampur": ["Balrampur", "Gaindas Bujurg", "Gainsari", "Harraiya Satgharwa", "Pachpedwa", "Rehra Bazar", "Shivpura", "Tulsipur", "Utraula"],
    "Banda": ["Baberu", "Badokhar Khurd", "Bisanda", "Jaspura", "Kamasin", "Mahuva", "Narahini", "Tindwari"],
    "Barabanki": ["Banki", "Bani Kodar", "Dariyabad", "Dewaji", "Fatehpur", "Haidergarh", "Harakh", "Masauli", "Nindura", "Ramnagar", "Siddhaur", "Suratganj", "Trivediganj"],
    "Bareilly": ["Alampur Jafrabad", "Baheri", "Bhadpura", "Bhojipura", "Bithri Chainpur", "Damkhoda", "Faridpur", "Fatehganj Paschim", "Kiyara", "Mirganj", "Nawabganj", "Ramnagar", "Rithora", "Shergarh"],
    "Basti": ["Bahadurpur", "Bankati", "Basti Sadar", "Captainganj", "Duboulia", "Gaur", "Harraiya", "Kudraha", "Parasrampur", "Ramnagar", "Rudauli", "Saltaua Gopalpur", "Sau Ghat", "Vikram Jot"],
    "Bijnor": ["Afzalgarh", "Aku", "Haldaur", "Jalilpur", "Kiratpur", "Kotwali", "Mohammadpur Deomal", "Najibabad", "Nehtaur", "Noorpur", "Seohara"],
    "Budaun": ["Ambiapur", "Asafpur", "Bilsi", "Bisauli", "Dahgawan", "Dataganj", "Islamnagar", "Jagat", "Miyanpin", "Qadar Chowk", "Sahaswan", "Salarpur", "Samrer", "Ujhani", "Wazirganj"],
    "Bulandshahr": ["Agauta", "Anupshahr", "Arnia", "BB Nagar", "Bulandshahr", "Danpur", "Dibai", "Gulaothi", "Jahangirabad", "Khurja", "Lakhaothi", "Pahasu", " शिकारpur", "Syana", "Unchagaon"],
    "Chitrakoot": ["Karwi", "Manikpur", "Mau", "Pahari", "Ramnagar"],
    "Deoria": ["Baitalpur", "Bankata", "Barhaj", "Bhagalpur", "Bhaluani", "Bhatni", "Bhatpar Rani", "Deoria", "Desahi Deoria", "Gauri Bazar", "Lar", "Pathardewa", "Rampur Karkhana", "Rudrapur", "Salempur", "Tarkulwa"],
    "Etah": ["Aliganj", "Awagarh", "Jaithara", "Jalesar", "Marhara", "Nidhauli Kalan", "Sakit", "Sheetalpur"],
    "Etawah": ["Barhpura", "Basrehar", "Bharthana", "Chakarnagar", "Jaswantnagar", "Mahewa", "Saifai", "Takha"],
    "Farrukhabad": ["Barhpur", "Kamalganj", "Kaimganj", "Mohammadabad", "Nawabganj", "Rajepur", "Shamsabad"],
    "Fatehpur": ["Airayan", "Amauli", "Asothar", "Bahua", "Bhitaura", "Deomai", "Dhata", "Hasanpur", "Haswa", "Khajuha", "Malwan", "Teliyani", "Vijayipur"],
    "Firozabad": ["Akaalpur", "Araon", "Eka", "Firozabad", "Jasrana", "Khairagarh", "Madanpur", "Narkhi", " शिकोहाबाद", "Tundla"],
    "Gautam Buddha Nagar": ["Bisrakh", "Dankaur", "Dadri", "Jewar"],
    "Ghaziabad": ["Bhojpur", "Loni", "Muradnagar", "Razapur"],
    "Gonda": ["Belsar", "Babhanjot", "Chhapia", "Colonelganj", "Haldhar Mau", "Itiathok", "Jhanjhari", "Katra Bazar", "Mankapur", "Mujehana", "Nawabganj", "Pandey Baba", "Paraspur", "Rupaidih", "Tarabganj", "Wazirganj"],
    "Hamirpur": ["Gohand", "Kurara", "Maudaha", "Muskara", "Rath", "Sarila", "Sumerpur"],
    "Hapur": ["Dhaulana", "Garhmukteshwar", "Hapur", "Simbhawali"],
    "Hardoi": ["Ahirori", "Bawan", "Bharawan", "Bharkhani", "Bilgram", "Harpalpur", "Kachhauna", "Kothawan", "Madhoganj", "Mallawan", "Pihani", "Sandila", "Sandi", "Shahabad", "Sursa", "Tandiyawan", "Todarpur"],
    "Hathras": ["Hasayan", "Hathras", "Mursan", "Sadabad", "Sahpau", "Sasni", "Sehpau"],
    "Jalaun": ["Dakore", "Jalaun", "Kadaura", "Konch", "Madhogarh", "Maheva", "Nadigaon", "Rendhar", "River"],
    "Jhansi": ["Babina", "Badagaon", "Bamhori", "Bamaur", "Chirgaon", "Gursarai", "Mauranipur", "Moth", "Ranipur"],
    "Kannauj": ["Chhibramau", "Guhari", "Haseran", "Jalalabad", "Kannauj", "Saurikh", "Talgram", "Umarda"],
    "Kasganj": ["Amanpur", "Ganjdundwara", "Kasganj", "Patiyali", "Sahawar", "Sidhpura", "Soron"],
    "Kaushambi": ["Chail", "Kanaili", "Kada", "Manjhanpur", "Mooratganj", "Newada", "Sarsawan", "Sirathu"],
    "Kheri": ["Bankeyganj", "Behjam", "Bijua", "Dhaurahra", "Gola Gokrannath", "Isanagar", "Khamariya", "Lakhimpur", "Mitauli", "Mohammadi", "Nakaha", "Nighasan", "Palia", "Pasgawan", "Phoolbehar", "Ramia Behar"],
    "Kushinagar": ["Dudhai", "Fazilnagar", "Hata", "Kaptanganj", "Kasya", "Khadha", "Motichak", "Nebua Naurangiya", "Padrauna", "Ramkola", "Seorahi", "Sukrauli", "Tamkuhi Raj", "Vishunpura"],
    "Lalitpur": ["Bar", "Birdha", "Jakhaura", "Lalitpur", "Madawara", "Mahroni", "Talbehat"],
    "Maharajganj": ["Brijmanganj", "Dhani", "Ghughli", "Laxmipur", "Maharajganj", "Mithaura", "Nichlaul", "Nautanwa", "Paniyara", "Partawal", "Ratanpur", "Siswa"],
    "Mahoba": ["Charkhari", "Jaitpur", "Kabrai", "Panwari"],
    "Mainpuri": ["Barnahal", "Bewar", "Ghiror", "Karhal", "Kishni", "Kuraoli", "Mainpuri", "Sultanganj"],
    "Mathura": ["Baldeo", "Chaumuha", "Chhata", "Farah", "Goverdhan", "Mant", "Mathura", "Nandgaon", "Naujhil", "Raya"],
    "Meerut": ["Daurala", "Hastinapur", "Janani", "Kharkhoda", "Machhra", "Mawana", "Meerut", "Parikshitgarh", "Rajpura", "Rohta", "Sarurpur"],
    "Moradabad": ["Bhagatpur Tanda", "Bilari", "Chhajlet", "Dilari", "Kundarki", "Moradabad", "Munda Pandey", "Thakurdwara"],
    "Muzaffarnagar": ["Baghra", "Budhana", "Charthawal", "Jansath", "Kandhla", "Khadkoli", "Morna", "Muzaffarnagar", "Purqazi", "Shahpur"],
    "Pilibhit": ["Amariya", "Barkhera", "Bilsanda", "Bisalpur", "Lalaurikhera", "Marori", "Puranpur"],
    "Pratapgarh": ["Aspur Deosara", "Babaganj", "Bihar", "Gaura", "Kalakankar", "Kunda", "Lakshmanpur", "Magraura", "Mandhata", "Patti", "Rampur Khas", "Rampur Sangramgarh", "Sandwa Chandika", "Shivgarh"],
    "Raebareli": ["Amawan", "Bachhrawan", "Deen Shah Gaura", "Dalmau", "Harchandpur", "Jagatpur", "Khiron", "Lalganj", "Maharajganj", "Rahi", "Rohania", "Sareni", "Sataon", "Singhpur", "Tiloi", "Unchahar"],
    "Rampur": ["Bilaspur", "Chamraua", "Milak", "Rampur", "Saidnagar", "Shahabad", "Suar"],
    "Saharanpur": ["Ballia Kheri", "Deoband", "Gangoh", "Muzaffarabad", "Naggal", "Nanauta", "Puwaraka", "Rampur Maniharan", "Sadauli Qadeem", "Sarsawa"],
    "Sambhal": ["Asmoli", "Bahjoi", "Bannadevi", "Gunnaur", "Junawai", "Pawansa", "Rajpura", "Sambhal"],
    "Sant Kabir Nagar": ["Baghnagar", "Belhar Kala", "Hainsar Bazar", "Khalilabad", "Mehdawal", "Nandaur", "Paoni", "Semariyawan", "Santha"],
    "Shahjahanpur": ["Banda", "Bhwal Khera", "Dadraul", "Jalalabad", "Jaitipur", "Kalalan", "Kanth", "Katra", "Khutar", "Madnapur", "Mirzapur", "Nigohi", "Powayan", "Sindhauli", "Tilhar"],
    "Shamli": ["Kairana", "Kandhla", "Oon", "Shamli", "Thanabhawan"],
    "Shravasti": ["Gilaula", "Hariharpur Rani", "Ikauna", "Jamunaha", "Sirsiya"],
    "Siddharthnagar": ["Bansi", "Barhni", "Birdpur", "Domariyaganj", "Itwa", "Jogia", "Khesraha", "Khuniyaon", "Lotan", "Mithwal", "Naugarh", "Shohratgarh", "Uska Bazar", "Uskabazar"],
    "Sitapur": ["Ailiya", "Biswan", "Hargaon", "Kasmanda", "Khairabad", "Laharpur", "Machhrehta", "Mahmudabad", "Maholi", "Misrikh", "Parsendi", "Pahala", "Pisawan", "Rampur Mathura", "Reusa", "Sakran", "Sidhauli"],
    "Sultanpur": ["Akhand Nagar", "Baldirai", "Bhadaiya", "Dhanpatganj", "Dostpur", "Dubeypur", "Jaisinghpur", "Kurebhar", "Kurwar", "Lambhua", "Motigarpur", "Pratappur Kamaicha"],
    "Unnao": ["Asoha", "Auras", "Bangarmau", "Bichhiya", "Bighapur", "Fatehpur Chaurasi", "Ganj Moradabad", "Hasanganj", "Hilauli", "Miyanganj", "Nawabganj", "Purwa", "Safipur", "Sikandarpur Karan", "Sikandarpur Sirausi", "Sumerpur"]
  },

  "Bihar": {
    "Patna": ["Bakhtiarpur", "Barh", "Belchi", "Bihta", "Bikram", "Danapur", "Daniyawan", "Dulhin Bazar", "Fatuha", "Ghoswari", "Khusrupur", "Maner", "Masaurhi", "Mokama", "Naubatpur", "Paliganj", "Pandarak", "Patna Rural", "Phulwari Sharif", "Punpun", "Sampatchak"],
    "Gaya": ["Amas", "Atri", "Bankey Bazar", "Barachatti", "Belaganj", "Bodh Gaya", "Dobhi", "Dumaria", "Fatehpur", "Guraru", "Gurua", "Imamganj", "Khizirsarai", "Konch", "Manpur", "Mohanpur", "Muhra", "Neem Chak Bathani", "Paraiya", "Sherghati", "Tan Kuppa", "Tikari", "Wazirganj"],
    "Muzaffarpur": ["Aurai", "Bandra", "Bochahan", "Gaighat", "Kanti", "Katra", "Kurhani", "Marwan", "Minapur", "Motipur", "Muraul", "Mushahari", "Paroo", "Sahebganj", "Sakra", "Saraiya"],
    "Bhagalpur": ["Bihpur", "Gopalpur", "Goradih", "Ismailpur", "Jagdishpur", "Kahalgaon", "Kharik", "Narayanpur", "Nathnagar", "Naugachhia", "Pirpainti", "Rangrachowk", "Sabour", "Sanhaula", "Shahkund", "Sultanganj"],
    "Rohtas": ["Akhorigola", "Bikramganj", "Chenari", "Dawath", "Dehri", "Dinara", "Karakat", "Kargahar", "Kochas", "Nasriganj", "Nauhatta", "Nokha", "Rajpur", "Rohtas", "Sanjhauli", "Sasaram", "Sheosagar", "Suryapura", "Tilouthu"],
    "Buxar": ["Brahampur", "Buxar", "Chakki", "Chaugain", "Chausa", "Dumraon", "Itarhi", "Kesath", "Nawanagar", "Rajpur", "Simri"],
    "Kaimur": ["Adhaura", "Bhagwanpur", "Bhabua", "Chainpur", "Chand", "Durgawati", "Kudra", "Mohania", "Ramgarh", "Rampur"],
    "Nalanda": ["Asthawan", "Ben", "Biharsharif", "Bind", "Chandi", "Ekangarsarai", "Giriyak", "Harnaut", "Hilsa", "Islampur", "Karai Parsurai", "Katrisarai", "Nagar Nausa", "Noorsarai", "Parwalpur", "Rahui", "Rajgir", "Sarmera", "Silao", "Tharthari"],
    "Vaishali": ["Bhagwanpur", "Bidupur", "Chehrakala", "Desri", "Goraul", "Hajipur", "Jandaha", "Lalganj", "Mahnar", "Mahuwa", "Patepur", "Patedhi Belsar", "Raghopur", "Raja Pakar", "Sahdei Buzurg", "Vaishali"],
    "Saran": ["Amnour", "Baniapur", "Chapra", "Dariyapur", "Dighwara", "Garkha", "Isuapur", "Jalalpur", "Lahladpur", "Maker", "Manjhi", "Marhaura", "Mashrakh", "Nagra", "Panapur", "Parsa", "Rivilganj", "Sonepur", "Taraiya"]
  },

  "Punjab": {
    "Ludhiana": ["Dehlon", "Doraha", "Jagraon", "Khanna", "Ludhiana-1", "Ludhiana-2", "Machhiwara", "Pakhowal", "Raikot", "Samrala", "Sidhwan Bet", "Sudhar"],
    "Amritsar": ["Ajnala", "Attari", "Chogawan", "Harsha Chhina", "Jandiala Guru", "Majitha", "Rayya", "Tarsikka", "Verka"],
    "Jalandhar": ["Adampur", "Bhogpur", "Jalandhar East", "Jalandhar West", "Lohian Khas", "Mehatpur", "Nakodar", "Nurmahal", "Phillaur", "Rurka Kalan", "Shahkot"],
    "Patiala": ["Bhunerheri", "Ghanaur", "Nabha", "Patiala", "Patran", "Rajpura", "Samana", "Sanour"],
    "Bathinda": ["Bathinda", "Bhagta Bhaika", "Maur", "Nathana", "Rampura Phul", "Sangat", "Talwandi Sabo"],
    "Sangrur": ["Ahmedgarh", "Andana", "Bhawanigarh", "Dhuri", "Dirba", "Lehragaga", "Malerkotla", "Sangrur", "Sherpur", "Sunam"],
    "Firozpur": ["Firozpur", "Ghall Khurd", "Guru Har Sahai", "Makhu", "Mamdot", "Zira"]
  },

  "Haryana": {
    "Karnal": ["Assandh", "Gharaunda", "Indri", "Karnal", "Kunjpura", "Munak", "Nilokheri", "Nissing"],
    "Hisar": ["Adampur", "Agroha", "Barwala", "Hansi-1", "Hansi-2", "Hisar-1", "Hisar-2", "Narnaund", "Uklana"],
    "Ambala": ["Ambala-1", "Ambala-2", "Barara", "Naraingarh", "Saha", "Shahzadpur"],
    "Kurukshetra": ["Babain", "Ismailabad", "Ladwa", "Pehowa", "Pipli", "Shahbad", "Thanesar"],
    "Panipat": ["Bapoli", "Israna", "Madlauda", "Panipat", "Samalkha", "Sanauli Khurd"],
    "Sirsa": ["Baragudha", "Dabwali", "Ellenabad", "Nathusari Chopta", "Rania", "Sirsa"],
    "Rohtak": ["Kalanaur", "Lakhan Majra", "Maham", "Rohtak", "Sampla"],
    "Sonipat": ["Ganaur", "Gohana", "Kharkhoda", "Mundlana", "Murthal", "Rai", "Sonipat"]
  },

  "Madhya Pradesh": {
    "Indore": ["Depalpur", "Indore", "Mhow (Dr. Ambedkar Nagar)", "Sanwer"],
    "Bhopal": ["Berasia", "Fanda"],
    "Jabalpur": ["Jabalpur", "Kundam", "Majhouli", "Panagar", "Patan", "Shahpura", "Sihora"],
    "Gwalior": ["Bhitarwar", "Dabra", "Ghatigaon", "Morar"],
    "Ujjain": ["Badnagar", "Ghatiya", "Khachrod", "Mahidpur", "Nagda", "Tarana", "Ujjain"],
    "Dewas": ["Bagli", "Dewas", "Kannod", "Khategaon", "Sonkatch", "Tonk Khurd"],
    "Narmadapuram": ["Babai", "Bankhedi", "Hoshangabad", "Pipariya", "Kesla", "Seoni Malwa", "Sohagpur"],
    "Dhar": ["Badnawar", "Dhar", "Dharampuri", "Gandhwani", "Kukshi", "Manawar", "Nalchha", "Nisarpur", "Sardarpur", "Tirla"],
    "Rewa": ["Gangev", "Hanumana", "Huzur", "Jawa", "Mauganj", "Naigarhi", "Raipur Karchuliyan", "Rewa", "Semariya", "Sirmaur", "Teonthar"],
    "Satna": ["Amarpatan", "Maihar", "Majhgawan", "Nagod", "Ramnagar", "Rampur Baghelan", "Satna", "Sohawal", "Uchehara"]
  },

  "Rajasthan": {
    "Jaipur": ["Amber", "Bassi", "Chaksu", "Govindgarh", "Jamwa Ramgarh", "Jhotwara", "Kotputli", "Paota", "Phagi", "Sambhar", "Sanganer", "Shahpura", "Viratnagar", "Wardha"],
    "Jodhpur": ["Baori", "Bhopalgarh", "Bilara", "Luni", "Mandor", "Osian", "Phalodi", "Shergarh"],
    "Kota": ["Chechat", "Itawa", "Khairabad", "Ladpura", "Sangod", "Sultanpur"],
    "Sri Ganganagar": ["Anupgarh", "Gharshana", "Karanpur", "Padampur", "Raisinghnagar", "Sadulshahar", "Sri Ganganagar", "Suratgarh"],
    "Hanumangarh": ["Bhadra", "Hanumangarh", "Nohar", "Pilibanga", "Rawatsar", "Sangaria", "Tibbi"],
    "Alwar": ["Behror", "Kathumar", "Kishangarh Bas", "Kotkasim", "Laxmangarh", "Mandawar", "Neemrana", "Rajgarh", "Ramgarh", "Reni", "Thanagazi", "Tijara", "Umren"],
    "Sikar": ["Danta Ramgarh", "Dhond", "Fatehpur", "Khandela", "Laxmangarh", "Neem Ka Thana", "Patan", "Piprali", "Srimadhopur"]
  },

  "Maharashtra": {
    "Pune": ["Ambegaon", "Baramati", "Bhor", "Daund", "Haveli", "Indapur", "Junnar", "Khed", "Maval", "Mulshi", "Purandar", "Shirur", "Velhe"],
    "Nashik": ["Baglan", "Chandwad", "Deola", "Dindori", "Igatpuri", "Kalwan", "Malegaon", "Nandgaon", "Nashik", "Niphad", "Peth", "Sinnar", "Surgana", "Trimbakeshwar", "Yeola"],
    "Nagpur": ["Hingna", "Kalmeshwar", "Kamptee", "Katol", "Kuhi", "Mouda", "Nagpur Rural", "Narkhed", "Parseoni", "Ramtek", "Saoner", "Umred"],
    "Kolhapur": ["Ajra", "Bavda", "Bhudargad", "Chandgad", "Gadhinglaj", "Hatkanangle", "Kagal", "Karvir", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"],
    "Aurangabad (Chhatrapati Sambhajinagar)": ["Aurangabad", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon", "Vaijapur"]
  },

  "Gujarat": {
    "Ahmedabad": ["Bavla", "Daskroi", "Detroj-Rampura", "Dhandhuka", "Dholera", "Dholka", "Mandal", "Sanand", "Viramgam"],
    "Rajkot": ["Dhoraji", "Gondal", "Jamkandorna", "Jasdan", "Jetpur", "Kotda Sangani", "Lodhika", "Paddhari", "Rajkot", "Upleta", "Vinchhiya"],
    "Surat": ["Bardoli", "Choryasi", "Kamrej", "Mahuva", "Mandvi", "Mangrol", "Olpad", "Palsana", "Umarpada"],
    "Vadodara": ["Dabhoi", "Desar", "Karjan", "Padra", "Savli", "Shinhor", "Vadodara Rural", "Vaghodia"],
    "Mehsana": ["Becharaji", "Jotana", "Kadi", "Kheralu", "Mehsana", "Satlasana", "Unjha", "Vadnagar", "Vijapur", "Visnagar"]
  }
};

/**
 * Returns sorted list of all available states (Uttar Pradesh placed first as primary hub)
 */
export const getStates = () => {
  const allStates = Object.keys(locationHierarchy);
  return allStates.sort((a, b) => {
    if (a === "Uttar Pradesh") return -1;
    if (b === "Uttar Pradesh") return 1;
    return a.localeCompare(b);
  });
};

/**
 * Returns sorted list of districts for a given state
 */
export const getDistricts = (stateName) => {
  if (!stateName || !locationHierarchy[stateName]) return [];
  return Object.keys(locationHierarchy[stateName]).sort((a, b) => a.localeCompare(b));
};

/**
 * Returns sorted list of blocks/tehsils for a given state and district
 */
export const getBlocks = (stateName, districtName) => {
  if (
    !stateName ||
    !districtName ||
    !locationHierarchy[stateName] ||
    !locationHierarchy[stateName][districtName]
  ) {
    return [];
  }
  return [...locationHierarchy[stateName][districtName]].sort((a, b) => a.localeCompare(b));
};

/**
 * Formats a location into a canonical string: "Block, District, State"
 */
export const formatLocation = ({ block = "", district = "", state = "Uttar Pradesh", village = "" } = {}) => {
  const parts = [];
  if (village && village.trim()) parts.push(village.trim());
  if (block && block.trim()) parts.push(block.trim());
  if (district && district.trim()) parts.push(district.trim());
  if (state && state.trim()) parts.push(state.trim());
  return parts.join(", ");
};

/**
 * Parses any location string (both legacy and new format) into { state, district, block, raw }
 */
export const parseLocation = (locationStr = "") => {
  if (!locationStr || typeof locationStr !== "string") {
    return { state: "Uttar Pradesh", district: "", block: "", raw: "" };
  }

  const raw = locationStr.trim();
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);

  // If 3 parts: [Block, District, State]
  if (parts.length >= 3) {
    const state = parts[parts.length - 1];
    const district = parts[parts.length - 2];
    const block = parts.slice(0, parts.length - 2).join(", ");
    return { state, district, block, raw };
  }

  // If 2 parts: [District, State] or [Block, District]
  if (parts.length === 2) {
    // Check if second part matches a known state
    if (locationHierarchy[parts[1]]) {
      return { state: parts[1], district: parts[0], block: "", raw };
    }
    // Assume parts[0] is block or district in UP
    return { state: "Uttar Pradesh", district: parts[1], block: parts[0], raw };
  }

  // If 1 part: legacy district name (e.g., "Varanasi")
  const single = parts[0];
  // Check if it's a known district in UP
  if (locationHierarchy["Uttar Pradesh"]?.[single]) {
    return { state: "Uttar Pradesh", district: single, block: "", raw };
  }

  // Default fallback
  return { state: "Uttar Pradesh", district: single, block: "", raw };
};

/**
 * Returns a compact display string suitable for card pills or badges (e.g. "Pindra, Varanasi" or "Varanasi (UP)")
 */
export const getShortLocation = (tractor) => {
  if (!tractor) return "Uttar Pradesh";

  // If discrete fields exist on tractor
  if (tractor.block && tractor.district) {
    return `${tractor.block}, ${tractor.district}`;
  }
  if (tractor.district) {
    return `${tractor.district}${tractor.state ? `, ${tractor.state}` : ""}`;
  }

  // Parse from location string
  const parsed = parseLocation(tractor.location || "");
  if (parsed.block && parsed.district) {
    return `${parsed.block}, ${parsed.district}`;
  }
  if (parsed.district) {
    return `${parsed.district} (UP)`;
  }
  return tractor.location || "Uttar Pradesh";
};
