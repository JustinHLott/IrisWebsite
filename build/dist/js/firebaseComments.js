

        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
        import { getDatabase, ref, push, set//, serverTimestamp
            //, update
            , query, orderByChild, equalTo, get
             } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";// if using Realtime DB

        import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
        import { auth } from "./firebaseAuth.js";
        //import { firebaseConfig } from "./firebaseAuth.js";
        import { app } from "./firebaseAuth.js";
        //import { serverTimestamp } from "firebase/database";
        //import { sanitizeInput } from "./firebaseLink.js";

        //const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        console.log("🔥 App initialized:", app);
        console.log("🗄️ DB instance:", db);

        function sanitizeInput(input) {
            return input
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
            }
        //import { theUserId } from "./firebaseLink.js"; 
        let userId = "";

  
          

/*
        // Runs whenever user signs in or out
        onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            console.log("User UID:", user.uid);
            userId = user.uid;
             
            // Save UID in a global variable or use directly
            //window.currentUserId = user.uid;
        } else {
            console.log("No user is logged in");
        }
        });
        
        
*/        
//Adding comments

        export function addComment1(){
            var commentTextV = sanitizeInput(document.getElementById("commentText").value);
            var postId = 1;
            const user = auth.currentUser;
            let currentDate = Date.now();
            if(commentTextV===""){
                alert("Please do not add empty text comments!")
            }else{
                addComment(postId, user.uid,commentTextV, currentDate);
            }
            
        }
        function addComment(postId, userId, text, currentDate) {
            const commentsRef = ref(db, 'comments');
            const newCommentRef = push(commentsRef); // generates a unique ID
            set(newCommentRef, { 
                postId: postId,
                userId: userId,
                text: text,
                createdAt: currentDate,
                updatedAt: currentDate
             })
            .then(() => getCommentsForPost(postId))
            .catch(err => console.error("❌ Error:", err));

        }
/*             
*/

/*

        
//Edit comments
        function editComment(commentId, newText) {
            const commentRef = ref(db, 'comments/' + commentId);

            update(commentRef, {
                text: newText,
                updatedAt: Date.now()
            })
            .then(() => console.log("Comment updated!"))
            .catch((error) => console.error("Error updating comment:", error));
            }
*/   
//Get comments
        function refresh(){
            getCommentsForPost(1)
        }

        async function getCommentsForPost(postId) {
            const commentsRef = ref(db, 'comments');
            console.log("commentsRef: " + commentsRef)
            const q = query(commentsRef, orderByChild("postId"), equalTo(postId));

            const snapshot = await get(q);

            const container = document.getElementById("theComments");
            // clear out old comments
            container.innerHTML = "";
            if (snapshot.exists()) {
                // Collect comments into an array
                const comments = [];
                snapshot.forEach((child) => {
                    comments.push({ id: child.key, ...child.val() });
                });

                // Sort by updatedAt descending (latest first)
                comments.sort((a, b) => b.updatedAt - a.updatedAt);

                // Render each comment
                comments.forEach((comment) => {
                const updatedDate = new Date(comment.updatedAt).toLocaleString();

                const line = document.createElement("p");
                line.textContent = `${comment.text.replace(/&#039;/g,"'")} (updated: ${updatedDate})`;

                container.appendChild(line);
                });

            } else {
                console.log("No comments found");
                document.getElementById("theComments").textContent = "No comments found";
            }
            } 
            
        // Bind to button in JS
        document.getElementById("addCommentBtn").addEventListener("click", () => { addComment1(); });
        // Bind to button in JS
        document.getElementById("refreshBtn").addEventListener("click", () => { refresh(); }); 
             