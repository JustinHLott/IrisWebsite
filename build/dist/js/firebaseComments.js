

        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
        import { getDatabase, ref, push, set//, serverTimestamp
            //, update
            , query, orderByChild, equalTo, get, onValue, remove
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
        var postId = 1;
      
//Adding comments

        export function addComment1(){
            var commentTextV = sanitizeInput(document.getElementById("commentText").value);
            //var postId = 1;
            const user = auth.currentUser;
            let currentDate = Date.now();
            if(commentTextV===""){
                alert("Please do not add empty text comments!")
            }else{
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        console.log("✅ Logged in as:", user.uid);
                        // Now safe to call
                        addComment(postId, user.uid, commentTextV, currentDate);
                    } else {
                        console.log("❌ No user logged in");
                        // Maybe redirect to login.html here
                    }
                });
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
            .then(() => console.log("Comment added successfully!")
            .catch(err => console.error("❌ Error:", err)))

        }

//Get comments
        async function getCommentsForPost(postId) {
            const commentUser = auth.currentUser;
            let theUid = "";

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // Now safe to call
                    theUid = user.uid;
                } else {
                    console.log("❌ No user logged in");
                }
            });
            const commentsRef = ref(db, 'comments');
            console.log("commentsRef: " + commentsRef)
            const q = query(commentsRef, orderByChild("postId"), equalTo(postId));

            //const snapshot = await get(q);

            const container = document.getElementById("theComments");

            onValue(q, (snapshot) => {
                // clear out old comments
                container.innerHTML = "";
                if (snapshot.exists()) {
                    // Collect comments into an array
                    const commentsArray = [];
                    snapshot.forEach((child) => {
                        commentsArray.push({ id: child.key, ...child.val() });
                    });

                    // Sort by updatedAt descending (latest first)
                    commentsArray.sort((a, b) => b.updatedAt - a.updatedAt);

                    // Render each comment
                    commentsArray.forEach((comment) => {
                    const updatedDate = new Date(comment.updatedAt).toLocaleString();

                    //create the card
                    const divC = document.createElement("div");
                    divC.style="align-content: left; align-items: left; width: 85%; text-align: left; margin-left: auto; margin-right: auto; margin-top: 0; margin-bottom: 10; border-bottom: 2px solid black;";
                    container.appendChild(divC);

                    //Add text to the card
                    const line = document.createElement("p");
                    line.textContent = `${comment.text.replace(/&#039;/g,"'").replace(/&quot;/g,'"')} (updated: ${updatedDate})`;
                    line.style="padding-left: 5; margin: 0;";
                    divC.appendChild(line);

                    //Add a button to the card
                    if(theUid === comment.userId){

                        // Create Edit button
                        const editBtn = document.createElement("button");
                        editBtn.textContent = "Edit";
                        editBtn.style="font-size: 1em;padding-top: 0;margin-top:0";

                        // Attach event listener for editing this comment
                        editBtn.addEventListener("click", () => {
                            const modal = document.getElementById("editModal");
                            const textarea = document.getElementById("editTextarea");
                            const saveBtn = document.getElementById("saveEditBtn");
                            const cancelBtn = document.getElementById("cancelEditBtn");

                            // Pre-fill textarea with the comment text
                            textarea.value = comment.text;

                            // Show modal
                            modal.style.display = "block";

                            // Save new text
                            saveBtn.onclick = () => {
                                const newText = textarea.value.trim();
                                if (newText) {
                                    const commentRef = ref(db, "comments/" + comment.id);
                                    set(commentRef, {
                                        ...comment,
                                        text: newText,
                                        updatedAt: Date.now()
                                    }).then(() => console.log("✏️ Comment updated"));
                                }
                                modal.style.display = "none";
                            };

                            // Cancel closes modal
                            cancelBtn.onclick = () => {
                                modal.style.display = "none";
                            };
                        });

                        // Delete button
                        const delBtn = document.createElement("button");
                        delBtn.textContent = "Delete";
                        delBtn.style="font-size: 1em;padding-top: 0;margin-top:0";

                        // Attach event listener for deleting this comment
                        delBtn.addEventListener("click", () => {
                            if (confirm("Are you sure you want to delete this comment?")) {
                                const commentRef = ref(db, "comments/" + comment.id);
                                remove(commentRef).then(() => console.log("🗑️ Comment deleted"));
                            }
                        });

                        divC.appendChild(editBtn);
                        divC.appendChild(delBtn);
                    }
                    });

                } else {
                    console.log("No comments found");
                    document.getElementById("theComments").textContent = "No comments found";
                }
            });
        } 
            
        // Bind to button in JS
        document.getElementById("addCommentBtn").addEventListener("click", () => { addComment1(); });
        // Bind to button in JS
  
        document.addEventListener("DOMContentLoaded", () => {
            // Replace 1 with your actual postId
            const postId = 1;  
            getCommentsForPost(postId);
        });
             