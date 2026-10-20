-- Question bank minimo: una domanda per ogni forma di risposta, piu' una scenario series di due domande.

INSERT INTO questions (number, type, answer_layout, question, explanation, answer_text, source, group_id, group_type, unordered_answer) VALUES
(1, 'multiple_choice', NULL,
 'You need to store files that VM1 and VM2 can share. Which two services should you use? Each correct answer presents a complete solution.',
 'Azure Files and Azure Blob storage both store files that several virtual machines can reach.',
 'A. Azure Files | C. Azure Blob storage', 'manual_vision', NULL, NULL, FALSE),
(2, 'drag_and_drop', 'ordered_answer',
 'You need to replicate VM1 to Azure. Which three actions should you perform in sequence?',
 'Step 1: Step one - It comes first. Step 2: Step two - It comes next. Step 3: Step three - It comes last.',
 '1. Step one -> 2. Step two -> 3. Step three', 'manual_vision', NULL, NULL, FALSE),
(3, 'drag_and_drop', 'ordered_answer',
 'You need to keep the template password out of plain text. Which of the following should you create?',
 'The answer is a set, not a sequence: a key vault and an access policy.',
 'Key vault | Access policy', 'manual_vision', NULL, NULL, TRUE),
(4, 'hotspot', 'selection',
 'You need to assign the least privileged role to each user. What should you assign?',
 'Box 1: Reader - User1 only reads. Box 2: Owner - User2 assigns roles.',
 'User1 -> Reader | User2 -> Owner', 'manual_vision', NULL, NULL, FALSE),
(5, 'hotspot_yes_no', 'yes_no',
 'For each of the following statements, select Yes if the statement is true. Otherwise, select No.',
 'Box 1: Yes - It is true. Box 2: No - It is false.',
 'VM1 can reach VM2. -> Yes | VM2 can reach VM3. -> No', 'manual_vision', NULL, NULL, FALSE),
(6, 'multiple_choice', NULL,
 'You need to view the deployments of RG1. Solution: From the RG1 blade, you click Deployments. Does this meet the goal?',
 'The Deployments blade lists every deployment of the resource group.',
 'A. Yes', 'text_layer', 'ss01', 'scenario_series', FALSE),
(7, 'multiple_choice', NULL,
 'You need to view the deployments of RG1. Solution: From the RG1 blade, you click Tags. Does this meet the goal?',
 'Tags do not show deployments.',
 'B. No', 'text_layer', 'ss01', 'scenario_series', FALSE);

INSERT INTO options (question_id, ord, letter, text, is_correct) VALUES
((SELECT id FROM questions WHERE number = 1), 0, 'A', 'Azure Files', TRUE),
((SELECT id FROM questions WHERE number = 1), 1, 'B', 'Azure Queue storage', FALSE),
((SELECT id FROM questions WHERE number = 1), 2, 'C', 'Azure Blob storage', TRUE),
((SELECT id FROM questions WHERE number = 1), 3, 'D', 'Azure Table storage', FALSE),
((SELECT id FROM questions WHERE number = 2), 0, NULL, 'Step two', TRUE),
((SELECT id FROM questions WHERE number = 2), 1, NULL, 'Distractor', FALSE),
((SELECT id FROM questions WHERE number = 2), 2, NULL, 'Step three', TRUE),
((SELECT id FROM questions WHERE number = 2), 3, NULL, 'Step one', TRUE),
((SELECT id FROM questions WHERE number = 3), 0, NULL, 'Storage account', FALSE),
((SELECT id FROM questions WHERE number = 3), 1, NULL, 'Access policy', TRUE),
((SELECT id FROM questions WHERE number = 3), 2, NULL, 'Key vault', TRUE),
((SELECT id FROM questions WHERE number = 6), 0, 'A', 'Yes', TRUE),
((SELECT id FROM questions WHERE number = 6), 1, 'B', 'No', FALSE),
((SELECT id FROM questions WHERE number = 7), 0, 'A', 'Yes', FALSE),
((SELECT id FROM questions WHERE number = 7), 1, 'B', 'No', TRUE);

INSERT INTO answer_rows (question_id, ord, prompt, answer) VALUES
((SELECT id FROM questions WHERE number = 2), 0, NULL, 'Step one'),
((SELECT id FROM questions WHERE number = 2), 1, NULL, 'Step two'),
((SELECT id FROM questions WHERE number = 2), 2, NULL, 'Step three'),
((SELECT id FROM questions WHERE number = 3), 0, NULL, 'Key vault'),
((SELECT id FROM questions WHERE number = 3), 1, NULL, 'Access policy'),
((SELECT id FROM questions WHERE number = 4), 0, 'User1', 'Reader'),
((SELECT id FROM questions WHERE number = 4), 1, 'User2', 'Owner'),
((SELECT id FROM questions WHERE number = 5), 0, 'VM1 can reach VM2.', 'Yes'),
((SELECT id FROM questions WHERE number = 5), 1, 'VM2 can reach VM3.', 'No');

INSERT INTO answer_row_options (answer_row_id, ord, text) VALUES
((SELECT r.id FROM answer_rows r JOIN questions q ON q.id = r.question_id WHERE q.number = 4 AND r.ord = 0), 0, 'Owner'),
((SELECT r.id FROM answer_rows r JOIN questions q ON q.id = r.question_id WHERE q.number = 4 AND r.ord = 0), 1, 'Reader'),
((SELECT r.id FROM answer_rows r JOIN questions q ON q.id = r.question_id WHERE q.number = 4 AND r.ord = 0), 2, 'Contributor'),
((SELECT r.id FROM answer_rows r JOIN questions q ON q.id = r.question_id WHERE q.number = 4 AND r.ord = 1), 0, 'Owner'),
((SELECT r.id FROM answer_rows r JOIN questions q ON q.id = r.question_id WHERE q.number = 4 AND r.ord = 1), 1, 'Reader');

INSERT INTO question_images (question_id, kind, ord, filename) VALUES
((SELECT id FROM questions WHERE number = 1), 'question', 0, 'q001_pre0.png'),
((SELECT id FROM questions WHERE number = 1), 'answer', 0, 'q001_post0.png');
